"""Diagnostic script to test face detection pipeline end-to-end."""

import sys
import os
import glob

# Test 1: Direct InsightFace detection (bypass API)
print("=" * 60)
print("TEST 1: Direct InsightFace detection")
print("=" * 60)

import cv2
import numpy as np

test_dir = "/Users/kha4a/Desktop/Vladimir"
pngs = sorted(glob.glob(os.path.join(test_dir, "*.png")))[:3]  # test first 3

if not pngs:
    print("ERROR: No PNG files found in", test_dir)
    sys.exit(1)

print(f"Found {len(glob.glob(os.path.join(test_dir, '*.png')))} total PNGs")
print(f"Testing first {len(pngs)} files...")

for png_path in pngs:
    img = cv2.imread(png_path)
    if img is None:
        print(f"  {os.path.basename(png_path)}: cv2.imread FAILED")
        continue
    h, w = img.shape[:2]
    print(
        f"  {os.path.basename(png_path)}: loaded {w}x{h}, channels={img.shape[2]}, dtype={img.dtype}"
    )

# Now test with InsightFace
from insightface.app import FaceAnalysis

print("\nLoading InsightFace model...")
app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
app.prepare(ctx_id=0, det_size=(640, 640))
print("Model loaded.\n")

for png_path in pngs:
    img = cv2.imread(png_path)
    if img is None:
        continue
    h, w = img.shape[:2]
    faces = app.get(img)
    print(f"  {os.path.basename(png_path)}: {w}x{h} -> {len(faces)} faces detected")
    for i, f in enumerate(faces):
        print(f"    face {i}: score={f.det_score:.3f}, bbox={f.bbox.tolist()}")

# Test 2: Same but via cv2.imdecode (like the API does)
print("\n" + "=" * 60)
print("TEST 2: cv2.imdecode (simulating API byte receive)")
print("=" * 60)

for png_path in pngs:
    with open(png_path, "rb") as f:
        raw_bytes = f.read()
    print(f"  {os.path.basename(png_path)}: file size = {len(raw_bytes)} bytes")
    np_arr = np.frombuffer(raw_bytes, dtype=np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        print(f"    cv2.imdecode FAILED!")
        continue
    h, w = img.shape[:2]
    faces = app.get(img)
    print(f"    decoded {w}x{h} -> {len(faces)} faces detected")

# Test 3: Via API HTTP call
print("\n" + "=" * 60)
print("TEST 3: Via HTTP API")
print("=" * 60)

import requests

url = "http://127.0.0.1:8000/api/v1/extract-faces"
files_payload = []
for png_path in pngs:
    files_payload.append(("files", (os.path.basename(png_path), open(png_path, "rb"), "image/png")))

try:
    resp = requests.post(url, files=files_payload, timeout=120)
    print(f"  Status: {resp.status_code}")
    data = resp.json()
    print(f"  images_processed: {data.get('images_processed')}")
    print(f"  total_faces_detected: {data.get('total_faces_detected')}")
    for face in data.get("faces", [])[:5]:
        print(
            f"    face idx={face['index']}, img_idx={face['image_index']}, score={face['detection_score']:.3f}"
        )
except Exception as e:
    print(f"  API call failed: {e}")
finally:
    for _, (_, fh, _) in zip(range(len(files_payload)), files_payload):
        fh.close()

print("\nDone.")
