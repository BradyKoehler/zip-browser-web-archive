#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CRATE_DIR="$ROOT_DIR/crates/zip-core"
OUT_DIR="$ROOT_DIR/app/src/wasm"
TARGET="wasm32-unknown-unknown"

TARGET_DIR="$ROOT_DIR/target"

echo "==> Building Rust crate to WASM..."
CARGO_TARGET_DIR="$TARGET_DIR" cargo build \
  --manifest-path "$CRATE_DIR/Cargo.toml" \
  --lib \
  --target "$TARGET" \
  --release

echo "==> Running wasm-bindgen..."
mkdir -p "$OUT_DIR"
wasm-bindgen \
  "$TARGET_DIR/$TARGET/release/zip_core.wasm" \
  --out-dir "$OUT_DIR" \
  --target web \
  --typescript

# Optimize with wasm-opt if available
if command -v wasm-opt &>/dev/null; then
  echo "==> Optimizing with wasm-opt..."
  wasm-opt "$OUT_DIR/zip_core_bg.wasm" \
    -o "$OUT_DIR/zip_core_bg.wasm" \
    -Oz
else
  echo "==> wasm-opt not found, skipping optimization"
fi

echo "==> WASM build complete. Output in $OUT_DIR"
