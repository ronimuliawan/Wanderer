use moka::future::Cache;
use std::path::PathBuf;
use tokio::fs;

#[derive(Clone)]
pub struct ThumbnailCache {
    inner: Cache<String, PathBuf>,
}

impl ThumbnailCache {
    pub fn new(capacity: u64) -> Self {
        let cache = Cache::builder()
            .max_capacity(capacity)
            .async_eviction_listener(|key, value: PathBuf, cause| {
                Box::pin(async move {
                    println!(
                        "Evicting thumbnail for {}: {:?} (cause: {:?})",
                        key, value, cause
                    );
                    if let Err(e) = fs::remove_file(&value).await {
                        eprintln!("Failed to delete evicted thumbnail: {}", e);
                    }
                })
            })
            .build();

        Self { inner: cache }
    }

    pub async fn get(&self, key: &str) -> Option<PathBuf> {
        self.inner.get(key).await
    }

    pub async fn insert(&self, key: String, path: PathBuf) {
        self.inner.insert(key, path).await;
    }
}
