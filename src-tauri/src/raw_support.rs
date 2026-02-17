//! RAW image format support
//!
//! This module handles thumbnail extraction from RAW camera files.
//! Most RAW formats embed a full-size JPEG preview that can be extracted
//! without decoding the actual RAW sensor data.

use std::fs::File;
use std::io::{BufReader, Read, Seek, SeekFrom};
use std::path::Path;

/// Supported RAW file extensions
pub const RAW_EXTENSIONS: &[&str] = &[
    "cr2", // Canon RAW 2
    "cr3", // Canon RAW 3
    "nef", // Nikon Electronic Format
    "arw", // Sony Alpha RAW
    "dng", // Digital Negative (Adobe)
    "orf", // Olympus RAW Format
    "rw2", // Panasonic RAW
    "raf", // Fujifilm RAW
    "pef", // Pentax Electronic Format
    "srw", // Samsung RAW
    "raw", // Generic RAW
];

/// Check if a file extension is a RAW format
pub fn is_raw_extension(ext: &str) -> bool {
    RAW_EXTENSIONS.contains(&ext.to_lowercase().as_str())
}

/// Extract embedded JPEG preview from a RAW file
///
/// Most RAW formats (CR2, NEF, ARW, DNG, etc.) contain an embedded JPEG preview.
/// This function attempts to locate and extract it without full RAW decoding.
///
/// Returns the JPEG bytes if found, or an error if not.
pub fn extract_embedded_jpeg(path: &Path) -> Result<Vec<u8>, String> {
    let file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut reader = BufReader::new(file);

    // Try to parse EXIF data and find embedded preview
    let exif_reader = exif::Reader::new();

    // Read the file to find EXIF thumbnail
    let exif_data = exif_reader
        .read_from_container(&mut reader)
        .map_err(|e| format!("Failed to read EXIF: {}", e))?;

    // Check for JPEG Interchange Format (JpegInterchangeFormat) thumbnail
    // This is Tag 0x0201 in IFD1 (thumbnail IFD)
    if let Some(thumbnail_offset) =
        exif_data.get_field(exif::Tag::JPEGInterchangeFormat, exif::In::THUMBNAIL)
    {
        if let Some(thumbnail_length) =
            exif_data.get_field(exif::Tag::JPEGInterchangeFormatLength, exif::In::THUMBNAIL)
        {
            let offset = thumbnail_offset
                .value
                .get_uint(0)
                .ok_or("Invalid thumbnail offset")?;
            let length = thumbnail_length
                .value
                .get_uint(0)
                .ok_or("Invalid thumbnail length")?;

            // Seek to thumbnail position and read it
            reader
                .seek(SeekFrom::Start(offset as u64))
                .map_err(|e| format!("Seek failed: {}", e))?;
            let mut jpeg_data = vec![0u8; length as usize];
            reader
                .read_exact(&mut jpeg_data)
                .map_err(|e| format!("Read failed: {}", e))?;

            // Verify it's a JPEG (starts with FFD8)
            if jpeg_data.len() >= 2 && jpeg_data[0] == 0xFF && jpeg_data[1] == 0xD8 {
                log::debug!(
                    "Extracted embedded JPEG thumbnail ({} bytes) from {:?}",
                    jpeg_data.len(),
                    path
                );
                return Ok(jpeg_data);
            }
        }
    }

    // Fallback: Scan for embedded JPEG markers in the file
    // This is a brute-force approach for files without proper EXIF thumbnail tags
    extract_jpeg_by_scanning(path)
}

/// Scan the RAW file for embedded JPEG by looking for JPEG markers
/// This is a fallback for files without proper EXIF thumbnail pointers
fn extract_jpeg_by_scanning(path: &Path) -> Result<Vec<u8>, String> {
    let mut file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // Look for JPEG start marker (FFD8) followed by FFE1 (EXIF) or FFE0 (JFIF)
    // Skip the first few bytes as they're typically the RAW header
    let min_offset = 1000; // Skip RAW header

    for i in min_offset..buffer.len().saturating_sub(10) {
        // Look for JPEG start of image marker
        if buffer[i] == 0xFF && buffer[i + 1] == 0xD8 {
            // Check if next bytes look like JPEG APP marker
            if buffer[i + 2] == 0xFF && (buffer[i + 3] == 0xE0 || buffer[i + 3] == 0xE1) {
                // Found potential JPEG start, now find the end
                for j in (i + 4)..buffer.len().saturating_sub(1) {
                    if buffer[j] == 0xFF && buffer[j + 1] == 0xD9 {
                        // Found EOI (End Of Image)
                        let jpeg_data = buffer[i..=j + 1].to_vec();

                        // Only accept if it's reasonably sized (at least 10KB, less than 50MB)
                        if jpeg_data.len() >= 10_000 && jpeg_data.len() < 50_000_000 {
                            log::debug!(
                                "Extracted JPEG by scanning ({} bytes) from {:?}",
                                jpeg_data.len(),
                                path
                            );
                            return Ok(jpeg_data);
                        }
                    }
                }
            }
        }
    }

    Err("No embedded JPEG found in RAW file".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_raw_extension() {
        assert!(is_raw_extension("CR2"));
        assert!(is_raw_extension("nef"));
        assert!(is_raw_extension("ARW"));
        assert!(!is_raw_extension("jpg"));
        assert!(!is_raw_extension("png"));
    }
}
