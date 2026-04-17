#!/bin/bash
trap 'kill 0' EXIT

# Load Tauri signing credentials (private key + optional password) if available.
# File lives outside the repo so it is never committed.
if [ -f "$HOME/.tauri/faceflow.env" ]; then
  # shellcheck source=/dev/null
  source "$HOME/.tauri/faceflow.env"
fi

# Do NOT set FACEFLOW_SECRET — build.rs reads activation.secret automatically.
unset FACEFLOW_SECRET

(cd cloud-api && .venv/bin/python3 -m uvicorn app.main:app --reload --port 8000) &
(cd faceflow-client && npm run tauri dev) &

wait
