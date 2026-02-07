import { reactive } from 'vue'
import { useZipArchive } from './useZipArchive'
import { detectPreviewType, getMimeType } from '../lib/file-utils'
import type { FileEntry, PreviewState } from '../types'

const state = reactive<PreviewState>({
  entry: null,
  type: 'none',
  blobUrl: null,
  textContent: null,
  loading: false,
  error: null,
})

export function useFilePreview() {
  const { extractFile } = useZipArchive()

  function openPreview(entry: FileEntry) {
    closePreview()
    state.entry = entry
    state.type = detectPreviewType(entry.name)
    state.loading = true
    state.error = null

    try {
      const data = extractFile(entry.index)
      if (!data) {
        state.error = 'Failed to extract file'
        state.loading = false
        return
      }

      // .slice() produces a clean Uint8Array<ArrayBuffer> for Blob compatibility
      const bytes = data.slice()
      if (state.type === 'text') {
        state.textContent = new TextDecoder().decode(bytes)
      } else {
        const mimeType = getMimeType(entry.name)
        const blob = new Blob([bytes], { type: mimeType })
        state.blobUrl = URL.createObjectURL(blob)
      }
    } catch (e: unknown) {
      state.error = e instanceof Error ? e.message : 'Preview failed'
    } finally {
      state.loading = false
    }
  }

  function closePreview() {
    if (state.blobUrl) {
      URL.revokeObjectURL(state.blobUrl)
    }
    state.entry = null
    state.type = 'none'
    state.blobUrl = null
    state.textContent = null
    state.loading = false
    state.error = null
  }

  function downloadFile(entry: FileEntry) {
    const data = extractFile(entry.index)
    if (!data) return
    const bytes = data.slice()
    const mimeType = getMimeType(entry.name)
    const blob = new Blob([bytes], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = entry.name.split('/').pop() || entry.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    previewState: state,
    openPreview,
    closePreview,
    downloadFile,
  }
}
