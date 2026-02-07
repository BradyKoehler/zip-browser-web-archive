export interface FileEntry {
  index: number
  name: string
  isDir: boolean
  size: number
  compressedSize: number
  compressionMethod: string
  encrypted: boolean
  lastModified: string | null
  crc32: number
}

export interface FileMetadataDetail extends FileEntry {
  compressionRatio: number
  unixMode: number | null
  comment: string
  headerStart: number
}

export interface DirectoryEntry {
  name: string
  fullPath: string
  isDir: boolean
  entry?: FileEntry
}

export type PreviewType = 'image' | 'text' | 'pdf' | 'audio' | 'video' | 'none'

export interface PreviewState {
  entry: FileEntry | null
  type: PreviewType
  blobUrl: string | null
  textContent: string | null
  loading: boolean
  error: string | null
}
