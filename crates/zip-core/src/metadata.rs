use serde::Serialize;
use std::io::{Read, Seek};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsError;
use zip::ZipArchive;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileEntry {
    pub index: usize,
    pub name: String,
    pub is_dir: bool,
    pub size: u64,
    pub compressed_size: u64,
    pub compression_method: String,
    pub encrypted: bool,
    pub last_modified: Option<String>,
    pub crc32: u32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileMetadataDetail {
    pub index: usize,
    pub name: String,
    pub is_dir: bool,
    pub size: u64,
    pub compressed_size: u64,
    pub compression_ratio: f64,
    pub compression_method: String,
    pub encrypted: bool,
    pub last_modified: Option<String>,
    pub crc32: u32,
    pub unix_mode: Option<u32>,
    pub comment: String,
    pub header_start: u64,
}

fn format_datetime(dt: &zip::DateTime) -> String {
    format!(
        "{:04}-{:02}-{:02}T{:02}:{:02}:{:02}",
        dt.year(),
        dt.month(),
        dt.day(),
        dt.hour(),
        dt.minute(),
        dt.second()
    )
}

impl FileEntry {
    pub fn from_zip_file(index: usize, file: &zip::read::ZipFile) -> Self {
        FileEntry {
            index,
            name: file.name().to_string(),
            is_dir: file.is_dir(),
            size: file.size(),
            compressed_size: file.compressed_size(),
            compression_method: format!("{:?}", file.compression()),
            encrypted: file.encrypted(),
            last_modified: file.last_modified().map(|dt| format_datetime(&dt)),
            crc32: file.crc32(),
        }
    }
}

pub fn get_metadata<R: Read + Seek>(
    archive: &mut ZipArchive<R>,
    index: usize,
) -> Result<JsValue, JsError> {
    let file = archive
        .by_index_raw(index)
        .map_err(|e| JsError::new(&format!("Failed to read entry {index}: {e}")))?;

    let ratio = if file.size() > 0 {
        file.compressed_size() as f64 / file.size() as f64
    } else {
        0.0
    };

    let detail = FileMetadataDetail {
        index,
        name: file.name().to_string(),
        is_dir: file.is_dir(),
        size: file.size(),
        compressed_size: file.compressed_size(),
        compression_ratio: ratio,
        compression_method: format!("{:?}", file.compression()),
        encrypted: file.encrypted(),
        last_modified: file.last_modified().map(|dt| format_datetime(&dt)),
        crc32: file.crc32(),
        unix_mode: file.unix_mode(),
        comment: file.comment().to_string(),
        header_start: file.header_start(),
    };

    serde_wasm_bindgen::to_value(&detail).map_err(|e| JsError::new(&e.to_string()))
}
