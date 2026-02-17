use std::io;
use std::pin::Pin;
use std::sync::Arc;
use std::task::{Context, Poll};
use std::time::Instant;
use tokio::io::AsyncRead;
use tokio::sync::Mutex;

/// Progress callback type - receives (bytes_uploaded, total_bytes, speed_bps)
pub type ProgressCallback = Arc<dyn Fn(u64, u64, f64) + Send + Sync>;

/// A wrapper around an AsyncRead that tracks read progress
pub struct ProgressStream<R> {
    inner: R,
    total_bytes: u64,
    bytes_read: Arc<Mutex<u64>>,
    start_time: Instant,
    callback: ProgressCallback,
    last_callback_bytes: u64,
    callback_threshold: u64, // Only call callback every N bytes
}

impl<R> ProgressStream<R> {
    pub fn new(inner: R, total_bytes: u64, callback: ProgressCallback) -> Self {
        // Call callback every ~64KB or 1% of file, whichever is larger
        let callback_threshold = (total_bytes / 100).max(65536);

        Self {
            inner,
            total_bytes,
            bytes_read: Arc::new(Mutex::new(0)),
            start_time: Instant::now(),
            callback,
            last_callback_bytes: 0,
            callback_threshold,
        }
    }

    fn calculate_speed(&self, bytes: u64) -> f64 {
        let elapsed = self.start_time.elapsed().as_secs_f64();
        if elapsed > 0.0 {
            bytes as f64 / elapsed
        } else {
            0.0
        }
    }
}

impl<R: AsyncRead + Unpin> AsyncRead for ProgressStream<R> {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut tokio::io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        let before_len = buf.filled().len();

        // Poll the inner reader
        let result = Pin::new(&mut self.inner).poll_read(cx, buf);

        if let Poll::Ready(Ok(())) = &result {
            let bytes_just_read = buf.filled().len() - before_len;

            if bytes_just_read > 0 {
                // Update bytes read (we can't await in poll, so we use try_lock)
                let current_bytes = {
                    let mut guard = self.bytes_read.try_lock().unwrap();
                    *guard += bytes_just_read as u64;
                    *guard
                };

                // Only invoke callback periodically to avoid overhead
                if current_bytes - self.last_callback_bytes >= self.callback_threshold
                    || current_bytes >= self.total_bytes
                {
                    self.last_callback_bytes = current_bytes;
                    let speed = self.calculate_speed(current_bytes);
                    (self.callback)(current_bytes, self.total_bytes, speed);
                }
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicU64, Ordering};
    use tokio::io::AsyncReadExt;

    #[tokio::test]
    async fn test_progress_stream() {
        let data = vec![0u8; 1024];
        let cursor = std::io::Cursor::new(data.clone());

        let progress_bytes = Arc::new(AtomicU64::new(0));
        let progress_bytes_clone = progress_bytes.clone();

        let callback: ProgressCallback = Arc::new(move |bytes, _total, _speed| {
            progress_bytes_clone.store(bytes, Ordering::SeqCst);
        });

        let mut stream = ProgressStream::new(cursor, 1024, callback);
        let mut output = Vec::new();
        stream.read_to_end(&mut output).await.unwrap();

        assert_eq!(output.len(), 1024);
        assert_eq!(progress_bytes.load(Ordering::SeqCst), 1024);
    }
}
