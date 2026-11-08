#!/bin/zsh

set -e

cd "$(dirname "$0")"

SLICE_PORT="${SLICE_PORT:-4177}"
SLICE_URL="http://127.0.0.1:${SLICE_PORT}/"

MACSETUP_PREVIEW_DIR="output/local-preview/$(date +%Y%m%d-%H%M%S)-$$"
node scripts/build-site.mjs --out "$MACSETUP_PREVIEW_DIR"
python3 -m http.server "$SLICE_PORT" --bind 127.0.0.1 --directory "$MACSETUP_PREVIEW_DIR" &
SLICE_SERVER_PID=$!

cleanup() {
  kill "$SLICE_SERVER_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

sleep 0.5
open "$SLICE_URL"
wait "$SLICE_SERVER_PID"
