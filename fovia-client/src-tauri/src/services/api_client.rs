use reqwest::multipart;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BoundingBox {
    pub x1: f64,
    pub y1: f64,
    pub x2: f64,
    pub y2: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FaceResult {
    pub index: usize,
    pub image_index: usize,
    pub bbox: BoundingBox,
    pub embedding: Vec<f64>,
    pub detection_score: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchResponse {
    pub faces: Vec<FaceResult>,
    pub images_processed: usize,
    pub total_faces_detected: usize,
}

pub struct ApiClient {
    client: reqwest::Client,
    base_url: String,
}

impl ApiClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            client: reqwest::Client::new(),
            base_url: base_url.to_string(),
        }
    }

    pub async fn extract_faces(
        &self,
        jpeg_batch: &[(String, Vec<u8>)],
    ) -> Result<BatchResponse, String> {
        let mut form = multipart::Form::new();

        for (filename, data) in jpeg_batch {
            let part = multipart::Part::bytes(data.clone())
                .file_name(filename.clone())
                .mime_str("image/jpeg")
                .map_err(|e| format!("Failed to create multipart part: {e}"))?;
            form = form.part("files", part);
        }

        let url = format!("{}/api/v1/extract-faces", self.base_url);

        let response = self
            .client
            .post(&url)
            .multipart(form)
            .send()
            .await
            .map_err(|e| format!("API request failed: {e}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("API error {status}: {body}"));
        }

        response
            .json::<BatchResponse>()
            .await
            .map_err(|e| format!("Failed to parse API response: {e}"))
    }
}
