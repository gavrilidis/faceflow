use std::path::{Path, PathBuf};
use walkdir::WalkDir;

const RAW_EXTENSIONS: &[&str] = &["cr2", "arw", "raw", "nef", "dng", "orf", "rw2", "raf"];

pub fn find_raw_files(root: &Path) -> Vec<PathBuf> {
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
                    .is_some_and(|ext| RAW_EXTENSIONS.contains(&ext.to_lowercase().as_str()))
        })
        .map(|entry| entry.into_path())
        .collect()
}
