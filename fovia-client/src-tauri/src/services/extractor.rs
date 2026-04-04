use std::path::Path;
use std::process::Command;

pub fn extract_jpeg_preview(raw_path: &Path) -> Result<Vec<u8>, String> {
    let output = Command::new("exiftool")
        .args(["-b", "-JpgFromRaw"])
        .arg(raw_path)
        .output()
        .map_err(|e| format!("Failed to execute exiftool: {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        // Fallback: try PreviewImage tag
        let fallback = Command::new("exiftool")
            .args(["-b", "-PreviewImage"])
            .arg(raw_path)
            .output()
            .map_err(|e| format!("exiftool fallback failed: {e}"))?;

        if !fallback.status.success() || fallback.stdout.is_empty() {
            return Err(format!(
                "No embedded JPEG in {}: {stderr}",
                raw_path.display()
            ));
        }
        return Ok(fallback.stdout);
    }

    if output.stdout.is_empty() {
        return Err(format!("Empty JPEG preview for {}", raw_path.display()));
    }

    Ok(output.stdout)
}
