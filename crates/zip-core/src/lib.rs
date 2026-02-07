use wasm_bindgen::prelude::*;

mod archive;
mod bomb_detect;
mod extract;
mod metadata;

pub use archive::*;
pub use metadata::*;

use std::io::Cursor;
use zip::ZipArchive;

/// Opaque handle to a loaded zip archive stored in WASM memory.
#[wasm_bindgen]
pub struct ZipHandle {
    archive: ZipArchive<Cursor<Vec<u8>>>,
}

#[wasm_bindgen]
impl ZipHandle {
    /// Load a zip file from raw bytes. Performs zip bomb detection on load.
    #[wasm_bindgen(constructor)]
    pub fn new(data: &[u8]) -> Result<ZipHandle, JsError> {
        let cursor = Cursor::new(data.to_vec());
        let archive =
            ZipArchive::new(cursor).map_err(|e| JsError::new(&format!("Invalid zip: {e}")))?;
        bomb_detect::check_bomb_indicators(&archive)?;
        Ok(ZipHandle { archive })
    }

    /// Number of entries in the archive.
    #[wasm_bindgen(getter)]
    pub fn entry_count(&self) -> usize {
        self.archive.len()
    }

    /// Returns a serialized array of FileEntry objects.
    pub fn list_entries(&mut self) -> Result<JsValue, JsError> {
        archive::list_entries(&mut self.archive)
    }

    /// Check if any entry in the archive is encrypted.
    pub fn needs_password(&mut self) -> bool {
        archive::any_entry_encrypted(&mut self.archive)
    }

    /// Extract a single file by index.
    pub fn extract_file(&mut self, index: usize) -> Result<Vec<u8>, JsError> {
        extract::extract_by_index(&mut self.archive, index)
    }

    /// Extract a single file by index with a password.
    pub fn extract_file_with_password(
        &mut self,
        index: usize,
        password: &str,
    ) -> Result<Vec<u8>, JsError> {
        extract::extract_by_index_with_password(&mut self.archive, index, password)
    }

    /// Get detailed metadata for a single entry.
    pub fn get_entry_metadata(&mut self, index: usize) -> Result<JsValue, JsError> {
        metadata::get_metadata(&mut self.archive, index)
    }
}
