from __future__ import annotations

from pydantic import BaseModel


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class FaceResult(BaseModel):
    index: int
    image_index: int
    bbox: BoundingBox
    embedding: list[float]
    detection_score: float


class BatchResponse(BaseModel):
    faces: list[FaceResult]
    images_processed: int
    total_faces_detected: int
