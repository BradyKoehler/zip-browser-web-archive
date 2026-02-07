use crate::bomb_detect;
use std::io::{Cursor, Read};
use wasm_bindgen::JsError;
use zip::ZipArchive;

const CHUNK_SIZE: usize = 64 * 1024;

pub fn extract_by_index(
    archive: &mut ZipArchive<Cursor<Vec<u8>>>,
    index: usize,
) -> Result<Vec<u8>, JsError> {
    let mut file = archive
        .by_index(index)
        .map_err(|e| JsError::new(&format!("Failed to extract entry {index}: {e}")))?;

    let declared_size = file.size();
    let mut buf = Vec::with_capacity(declared_size.min(bomb_detect::MAX_TOTAL_DECOMPRESSED) as usize);
    let mut chunk = vec![0u8; CHUNK_SIZE];

    loop {
        let n = file
            .read(&mut chunk)
            .map_err(|e| JsError::new(&format!("Read error: {e}")))?;
        if n == 0 {
            break;
        }
        buf.extend_from_slice(&chunk[..n]);
        bomb_detect::enforce_extraction_limit(buf.len() as u64, declared_size)?;
    }

    Ok(buf)
}

pub fn extract_by_index_with_password(
    archive: &mut ZipArchive<Cursor<Vec<u8>>>,
    index: usize,
    password: &str,
) -> Result<Vec<u8>, JsError> {
    let mut file = archive
        .by_index_decrypt(index, password.as_bytes())
        .map_err(|e| JsError::new(&format!("Failed to decrypt entry {index}: {e}")))?;

    let declared_size = file.size();
    let mut buf = Vec::with_capacity(declared_size.min(bomb_detect::MAX_TOTAL_DECOMPRESSED) as usize);
    let mut chunk = vec![0u8; CHUNK_SIZE];

    loop {
        let n = file
            .read(&mut chunk)
            .map_err(|e| JsError::new(&format!("Read error: {e}")))?;
        if n == 0 {
            break;
        }
        buf.extend_from_slice(&chunk[..n]);
        bomb_detect::enforce_extraction_limit(buf.len() as u64, declared_size)?;
    }

    Ok(buf)
}
