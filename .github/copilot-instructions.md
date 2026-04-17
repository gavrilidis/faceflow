# Copilot Instructions

## Project Overview

**Fovia** — desktop utility for expedition photographers. Sorts massive RAW photo datasets by detecting and grouping human faces via AI.

**Architecture:** Thin Client + Cloud ML.

| Layer | Path | Stack |
|-------|------|-------|
| Desktop Client | `fovia-client/` | Tauri 2.x (Rust backend) + React 19 + TypeScript + Tailwind CSS 4 + Vite |
| Cloud API | `cloud-api/` | FastAPI (Python 3.11+) + InsightFace (Buffalo_L) + OpenCV + ONNX Runtime |

## Role & Mindset

- Act as a **Senior Software Engineer** focused on performance, security, and readability.
- Write production-grade code. No prototypes, no throwaway snippets.
- **Zero tolerance for overengineering.** Do the simplest correct thing. No abstractions without proven need.
- Prefer deleting code over adding code. Every line must justify its existence.

## Tauri / Rust Backend (`fovia-client/src-tauri/`)

- All heavy I/O (file system traversal, image extraction, HTTP calls to Cloud API) happens in the **Rust backend** via Tauri commands (`#[tauri::command]`).
- Commands must be `async` when calling the network. Use `tokio` for async runtime.
- Return `Result<T, String>` from commands — Tauri serializes the error string to the frontend.
- Use `tauri::Emitter` (`app.emit(...)`) for real-time progress events to the frontend.
- Keep command handlers thin — extract business logic into `services/` modules.
- Never use `unwrap()` or `expect()` in production paths. Always propagate errors with `?` or `.map_err(...)`.
- Use `log::info!` / `log::warn!` / `log::error!` for structured logging (the `log` crate is already configured).
- External tools (`exiftool`) are invoked via `std::process::Command`. Always check `output.status.success()` and handle empty `stdout`.

## React / TypeScript Frontend (`fovia-client/src/`)

- **TypeScript strict mode is mandatory** (`"strict": true` in `tsconfig.json`).
- **`any` is forbidden.** Use `unknown` and narrow explicitly.
- **`@ts-ignore` and `@ts-expect-error` are forbidden.** Fix the type error instead.
- All shared types live in `src/types/index.ts`. Keep them in sync with Rust structs in `commands/scan.rs`.
- Prefer `interface` for object shapes and `type` for unions/intersections.
- Use `invoke<T>()` from `@tauri-apps/api/core` to call Rust commands. Always specify the return type generic.
- Use `listen<T>()` from `@tauri-apps/api/event` for progress events. Always clean up listeners in `useEffect` return.
- Components are functional. No class components.
- Use named exports (`export const Component`), not default exports.
- Styling: **Tailwind CSS 4** utility classes only. Use CSS custom properties from `index.css` (`var(--bg-primary)`, `var(--accent)`, etc.) for the macOS dark theme. No CSS-in-JS, no CSS modules.
- Keep components small and single-purpose. Extract reusable UI into `components/`.
- Services (pure logic like face grouping) live in `src/services/`.

## FastAPI / Python Cloud API (`cloud-api/`)

- Python **3.11+** with type hints on every function signature.
- Use **Pydantic models** (`app/models/schemas.py`) for all request/response shapes. Never pass raw dicts across boundaries.
- Configuration via `pydantic-settings` (`app/core/config.py`). Environment variables prefixed with `FOVIA_`.
- The `FaceDetectionService` class in `app/services/face_detection.py` is a singleton. Model loading is lazy (first request).
- API routes live in `app/routers/`. Each router has its own file.
- Always validate input: check `file.content_type`, enforce `max_batch_size`, handle empty/corrupt images gracefully.
- Use Python's `logging` module (already configured in `main.py`). Never `print()` in production code.
- Linting: **Ruff** (`ruff.toml` in project root). Run `ruff check` and `ruff format` before committing Python code.

## Code Style & Architecture (All Languages)

- **Functional approach in TypeScript.** Avoid classes. Use plain functions, closures, and modules. In Rust and Python, structs/classes are acceptable where idiomatic.
- **Early return pattern.** Handle edge cases and errors at the top of the function, then proceed with the happy path. No deep nesting.
- **Small, single-purpose functions.** If a function does more than one thing, split it. Target ≤30 lines per function.
- Name variables and functions descriptively. No abbreviations except universally understood ones (`id`, `url`, `ctx`, `img`, `bbox`).
- TypeScript: `const` by default, `let` only when reassignment is necessary. Never `var`.
- Collocate related code. Keep utilities close to where they are used (`services/`, `commands/`, `components/`).
- Handle errors at the boundary (Tauri command handler, API route). Inner functions propagate errors up; outer handlers catch and respond.

## Build & Run

```bash
# Cloud API
cd cloud-api && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Desktop Client
cd fovia-client && npm install
npm run tauri dev          # dev mode
npm run build              # frontend only: tsc + vite build
npm run lint               # eslint
npm run format             # prettier
```

## Prerequisites

- Python 3.11+, Rust 1.77+, Node.js 20+
- `exiftool` (`brew install exiftool`) — required for RAW file preview extraction
- Cloud API must be running at `http://127.0.0.1:8000` for the desktop client to work
