# FaceFlow — App Store Listing

## App Name

FaceFlow — AI Photo Sorter

## Subtitle

Face-powered photo sorting for expedition photographers

## Category

Photography

## Pricing

Paid — one-time purchase (or subscription, TBD)

---

## Description

FaceFlow is a professional desktop utility designed for expedition photographers who shoot thousands of RAW photos and need to sort them by person quickly and accurately.

**How it works:**
Drop a folder of photos onto FaceFlow. The app scans every image, detects faces using AI, generates identity embeddings, and automatically groups photos by person. No cloud processing — everything runs locally on your Mac.

**Key features:**

- AI Face Grouping — Automatically identifies and clusters photos by person using state-of-the-art face recognition (InsightFace ArcFace model with Agglomerative Hierarchical Clustering)
- RAW & HEIC Support — Handles CR2, ARW, NEF, DNG, ORF, RW2, RAF, HEIC, HEIF, AVIF, JPEG, PNG, WebP, TIFF, BMP, GIF — over 20 formats
- Star Ratings (0-5), Color Labels (Red, Yellow, Green, Blue), Pick/Reject Flags — all keyboard-driven
- Cross-Person Selection — Select photos across groups for side-by-side comparison
- Move Between Persons — Reassign misidentified photos with one click
- Compare View — Side-by-side full-resolution comparison
- Event Timeline — Auto-group photos by time gaps
- Quality Detection — Blur score and closed-eye detection
- EXIF Inspector — Full metadata display
- Export — Copy selected photos to a destination folder
- Auto-Updates — Built-in update mechanism

**Privacy-first:**
All face detection and recognition runs entirely on your Mac using ONNX Runtime. No photos or personal data leave your device. Only your license key is verified online (one-time). After initial setup, the app works fully offline.

**System Requirements:**
- macOS 11.0 (Big Sur) or later
- Apple Silicon (M1/M2/M3/M4) or Intel Mac
- 500 MB free disk space

---

## Keywords

face recognition, photo sorting, RAW photos, expedition, photographer, face detection, AI, HEIC, portrait, grouping

---

## What's New (v0.1.0)

- Initial release
- AI-powered face detection and grouping
- Support for 20+ image formats including RAW and HEIC
- Agglomerative Hierarchical Clustering for accurate face grouping
- Star ratings, color labels, pick/reject flags
- Cross-person selection and photo reassignment
- Compare view, event timeline, quality detection
- EXIF metadata inspector
- Export functionality
- In-app help with keyboard shortcuts reference
- Offline-first architecture with local ONNX inference

---

## Screenshots Required (Mac App Store)

1. **Drop Zone** — Main screen showing folder selection, supported formats list, detection threshold slider
2. **Gallery View** — Face groups in sidebar, photo grid with ratings and color labels
3. **Compare View** — Side-by-side comparison of two photos
4. **Setup Screen** — Privacy notice with consent, model download progress
5. **Help Dialog** — In-app documentation with tabs

---

## Privacy Policy URL

(Required for App Store submission — must be hosted publicly)

**Content for the privacy policy:**

FaceFlow does not collect, store, or transmit any personal data, photos, or face recognition results. All image processing occurs locally on the user's device using on-device AI models. The only network communication is:

1. License key verification (one-time activation)
2. AI model download (first launch only)
3. Update checks (periodic, opt-in)

No analytics, telemetry, or tracking of any kind is included in FaceFlow.

---

## App Review Notes

FaceFlow requires a license key for activation. Please use the following demo key for review:

**Demo Key:** [INSERT_REVIEW_KEY_HERE]

The app downloads two ONNX model files (~183 MB total) on first launch for local face detection. This requires an internet connection during initial setup only. After setup, the app works fully offline.

To test the core functionality:
1. Launch the app and enter the demo key
2. Allow model download to complete
3. Drop any folder containing photos with faces
4. Observe automatic face grouping in the sidebar
5. Try rating, labeling, and sorting photos using keyboard shortcuts

---

## Age Rating

4+ (No objectionable content)

## Content Rights

All AI models (InsightFace/ArcFace) are used under their respective open-source licenses for non-commercial research. ExifTool is GPL-licensed. Application code is MIT-licensed.
