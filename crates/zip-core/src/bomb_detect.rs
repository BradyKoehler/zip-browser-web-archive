use std::io::{Read, Seek};
use wasm_bindgen::JsError;
use zip::ZipArchive;

/// Maximum number of entries allowed.
const MAX_ENTRY_COUNT: usize = 100_000;

/// Maximum total decompressed size in bytes (4 GB).
pub const MAX_TOTAL_DECOMPRESSED: u64 = 4_000_000_000;

/// Check archive-level bomb indicators on load.
pub fn check_bomb_indicators<R: Read + Seek>(archive: &ZipArchive<R>) -> Result<(), JsError> {
    // Check 1: Entry count
    if archive.len() > MAX_ENTRY_COUNT {
        return Err(JsError::new(&format!(
            "Potential zip bomb: {} entries exceeds limit of {}",
            archive.len(),
            MAX_ENTRY_COUNT
        )));
    }

    // Check 2: Total decompressed size from central directory
    if let Some(total) = archive.decompressed_size() {
        if total > MAX_TOTAL_DECOMPRESSED as u128 {
            return Err(JsError::new(&format!(
                "Potential zip bomb: declared decompressed size ({} bytes) exceeds {} byte limit",
                total, MAX_TOTAL_DECOMPRESSED
            )));
        }
    }

    Ok(())
}

/// Enforce per-entry extraction limits during streaming decompression.
pub fn enforce_extraction_limit(decompressed_so_far: u64, declared_size: u64) -> Result<(), JsError> {
    // Abort if we've decompressed more than 2x the declared size
    if declared_size > 0 && decompressed_so_far > declared_size * 2 {
        return Err(JsError::new(
            "Potential zip bomb: decompressed data far exceeds declared size",
        ));
    }

    // Absolute limit
    if decompressed_so_far > MAX_TOTAL_DECOMPRESSED {
        return Err(JsError::new(
            "Extraction limit exceeded: file too large to decompress safely",
        ));
    }

    Ok(())
}
