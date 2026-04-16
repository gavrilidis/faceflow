use std::path::{Path, PathBuf};
use walkdir::WalkDir;

const RAW_EXTENSIONS: &[&str] = &["cr2", "arw", "raw", "nef", "dng", "orf", "rw2", "raf"];
/// Formats that require exiftool for JPEG extraction (not natively decoded by the `image` crate).
const EXIFTOOL_EXTENSIONS: &[&str] = &["heic", "heif", "avif"];
const IMAGE_EXTENSIONS: &[&str] = &["jpg", "jpeg", "png", "bmp", "tiff", "tif", "webp", "gif"];

/// Returns true for formats that need exiftool to extract a viewable JPEG
/// (RAW camera formats + Apple HEIC/HEIF + AVIF).
pub fn needs_exiftool(ext: &str) -> bool {
    let lower = ext.to_lowercase();
    RAW_EXTENSIONS.contains(&lower.as_str()) || EXIFTOOL_EXTENSIONS.contains(&lower.as_str())
}

pub fn find_image_files(root: &Path) -> Vec<PathBuf> {
    WalkDir::new(root)
        .follow_links(true)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| {
            entry.file_type().is_file()
                && entry
                    .path()
                    .extension()
                    .and_then(|ext| ext.to_str())
                    .is_some_and(|ext| {
                        let lower = ext.to_lowercase();
                        RAW_EXTENSIONS.contains(&lower.as_str())
                            || EXIFTOOL_EXTENSIONS.contains(&lower.as_str())
                            || IMAGE_EXTENSIONS.contains(&lower.as_str())
                    })
        })
        .map(|entry| entry.into_path())
        .collect()
}
