use std::io::Cursor;
use std::path::Path;
use std::process::Command;

use image::codecs::jpeg::JpegEncoder;
use image::ImageReader;

use crate::services::scanner;

/// Maximum dimension (width or height) for images sent to the API.
const MAX_DIMENSION: u32 = 1600;
/// JPEG quality for compressed output (0-100).
const JPEG_QUALITY: u8 = 80;

/// Read image bytes for the API.
/// - RAW files: extract embedded JPEG via exiftool.
/// - Standard images: resize/compress locally to JPEG to save bandwidth.
pub fn extract_image_bytes(image_path: &Path) -> Result<Vec<u8>, String> {
    let ext = image_path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");

    if scanner::is_raw_extension(ext) {
        extract_jpeg_from_raw(image_path)
    } else {
        compress_standard_image(image_path)
    }
}

/// Open a standard image (PNG, JPG, etc.), resize if larger than MAX_DIMENSION,
/// and re-encode as JPEG in memory. This turns a 50+ MB PNG into a ~200 KB JPEG.
fn compress_standard_image(image_path: &Path) -> Result<Vec<u8>, String> {
    let img = ImageReader::open(image_path)
        .map_err(|e| format!("Failed to open {}: {e}", image_path.display()))?
        .decode()
        .map_err(|e| format!("Failed to decode {}: {e}", image_path.display()))?;

    let (w, h) = (img.width(), img.height());
    let resized = if w > MAX_DIMENSION || h > MAX_DIMENSION {
        img.resize(
            MAX_DIMENSION,
            MAX_DIMENSION,
            image::imageops::FilterType::Triangle,
        )
    } else {
        img
    };

    let mut buf = Cursor::new(Vec::new());
    let encoder = JpegEncoder::new_with_quality(&mut buf, JPEG_QUALITY);
    resized
        .write_with_encoder(encoder)
        .map_err(|e| format!("Failed to encode {}: {e}", image_path.display()))?;

    let jpeg_bytes = buf.into_inner();
    log::info!(
        "Compressed {}: {}x{} -> {}x{}, {:.1} KB",
        image_path.file_name().unwrap_or_default().to_string_lossy(),
        w,
        h,
        resized.width(),
        resized.height(),
        jpeg_bytes.len() as f64 / 1024.0,
    );

    Ok(jpeg_bytes)
}

fn extract_jpeg_from_raw(raw_path: &Path) -> Result<Vec<u8>, String> {
    let output = Command::new("exiftool")
        .args(["-b", "-JpgFromRaw"])
        .arg(raw_path)
        .output()
        .map_err(|e| format!("Failed to execute exiftool: {e}"))?;

    if !output.status.success() || output.stdout.is_empty() {
        let fallback = Command::new("exiftool")
            .args(["-b", "-PreviewImage"])
            .arg(raw_path)
            .output()
            .map_err(|e| format!("exiftool fallback failed: {e}"))?;

        if !fallback.status.success() || fallback.stdout.is_empty() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!(
                "No embedded JPEG in {}: {stderr}",
                raw_path.display()
            ));
        }
        return Ok(fallback.stdout);
    }

    Ok(output.stdout)
}
