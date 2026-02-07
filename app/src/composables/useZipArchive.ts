import { ref, readonly } from 'vue'
import { loadArchive, ZipHandle } from '../lib/wasm-bridge'
import type { FileEntry } from '../types'

const handle = ref<ZipHandle | null>(null)
const entries = ref<FileEntry[]>([])
const needsPassword = ref(false)
const password = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const fileName = ref<string | null>(null)

export function useZipArchive() {
  async function openZip(file: File) {
    loading.value = true
    error.value = null
    try {
      const buffer = await file.arrayBuffer()
      const data = new Uint8Array(buffer)
      const h = await loadArchive(data)
      handle.value = h
      fileName.value = file.name
      needsPassword.value = h.needs_password()
      if (!needsPassword.value) {
        entries.value = h.list_entries() as FileEntry[]
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to open zip file'
    } finally {
      loading.value = false
    }
  }

  async function unlockWithPassword(pw: string) {
    if (!handle.value) return
    password.value = pw
    error.value = null
    try {
      entries.value = handle.value.list_entries() as FileEntry[]
      needsPassword.value = false
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to read archive'
    }
  }

  function extractFile(index: number): Uint8Array | null {
    if (!handle.value) return null
    try {
      if (password.value) {
        return handle.value.extract_file_with_password(index, password.value)
      }
      return handle.value.extract_file(index)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Extraction failed'
      return null
    }
  }

  function getMetadata(index: number): unknown {
    if (!handle.value) return null
    try {
      return handle.value.get_entry_metadata(index)
    } catch {
      return null
    }
  }

  function closeArchive() {
    handle.value?.free()
    handle.value = null
    entries.value = []
    needsPassword.value = false
    password.value = null
    fileName.value = null
    error.value = null
  }

  return {
    entries: readonly(entries),
    needsPassword: readonly(needsPassword),
    loading: readonly(loading),
    error: readonly(error),
    fileName: readonly(fileName),
    hasArchive: () => handle.value !== null,
    openZip,
    unlockWithPassword,
    extractFile,
    getMetadata,
    closeArchive,
  }
}
