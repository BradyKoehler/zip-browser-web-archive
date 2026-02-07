use crate::metadata::FileEntry;
use std::io::{Read, Seek};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsError;
use zip::ZipArchive;

pub fn list_entries<R: Read + Seek>(archive: &mut ZipArchive<R>) -> Result<JsValue, JsError> {
    let mut entries = Vec::with_capacity(archive.len());

    for i in 0..archive.len() {
        let file = archive
            .by_index_raw(i)
            .map_err(|e| JsError::new(&format!("Failed to read entry {i}: {e}")))?;
        entries.push(FileEntry::from_zip_file(i, &file));
    }

    serde_wasm_bindgen::to_value(&entries).map_err(|e| JsError::new(&e.to_string()))
}

pub fn any_entry_encrypted<R: Read + Seek>(archive: &mut ZipArchive<R>) -> bool {
    for i in 0..archive.len() {
        if let Ok(file) = archive.by_index_raw(i) {
            if file.encrypted() {
                return true;
            }
        }
    }
    false
}
