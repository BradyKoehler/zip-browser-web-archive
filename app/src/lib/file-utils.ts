import type { PreviewType } from '../types'

const PREVIEW_TYPE_MAP: Record<string, PreviewType> = {
  // Images
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image',
  webp: 'image', svg: 'image', bmp: 'image', ico: 'image', avif: 'image',
  // Text / Code
  txt: 'text', md: 'text', json: 'text', xml: 'text',
  html: 'text', htm: 'text', css: 'text', js: 'text', ts: 'text',
  jsx: 'text', tsx: 'text', vue: 'text', svelte: 'text',
  py: 'text', rs: 'text', go: 'text', java: 'text',
  c: 'text', cpp: 'text', h: 'text', hpp: 'text',
  rb: 'text', php: 'text', sh: 'text', bash: 'text', zsh: 'text',
  yml: 'text', yaml: 'text', toml: 'text', ini: 'text', conf: 'text',
  csv: 'text', log: 'text', env: 'text', gitignore: 'text',
  sql: 'text', graphql: 'text', proto: 'text',
  makefile: 'text', dockerfile: 'text',
  // PDF
  pdf: 'pdf',
  // Audio
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio',
  aac: 'audio', m4a: 'audio', weba: 'audio',
  // Video
  mp4: 'video', webm: 'video', ogv: 'video', mov: 'video',
}

const MIME_MAP: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  bmp: 'image/bmp', ico: 'image/x-icon', avif: 'image/avif',
  pdf: 'application/pdf',
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
  flac: 'audio/flac', aac: 'audio/aac', m4a: 'audio/mp4', weba: 'audio/webm',
  mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', mov: 'video/quicktime',
  json: 'application/json', xml: 'application/xml',
  html: 'text/html', css: 'text/css', js: 'text/javascript',
  txt: 'text/plain',
}

const FILE_TYPE_LABELS: Record<string, string> = {
  png: 'PNG Image', jpg: 'JPEG Image', jpeg: 'JPEG Image', gif: 'GIF Image',
  webp: 'WebP Image', svg: 'SVG Image', bmp: 'BMP Image', avif: 'AVIF Image',
  pdf: 'PDF Document',
  mp3: 'MP3 Audio', wav: 'WAV Audio', ogg: 'OGG Audio', flac: 'FLAC Audio',
  mp4: 'MP4 Video', webm: 'WebM Video', mov: 'QuickTime Video',
  json: 'JSON', xml: 'XML', html: 'HTML', css: 'CSS',
  js: 'JavaScript', ts: 'TypeScript', jsx: 'JSX', tsx: 'TSX',
  vue: 'Vue', svelte: 'Svelte',
  py: 'Python', rs: 'Rust', go: 'Go', java: 'Java',
  c: 'C', cpp: 'C++', h: 'C Header', hpp: 'C++ Header',
  rb: 'Ruby', php: 'PHP', sh: 'Shell', sql: 'SQL',
  yml: 'YAML', yaml: 'YAML', toml: 'TOML', ini: 'INI',
  md: 'Markdown', txt: 'Text', csv: 'CSV', log: 'Log',
  zip: 'ZIP Archive', gz: 'GZip Archive', tar: 'TAR Archive',
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return ''
  return filename.slice(lastDot + 1).toLowerCase()
}

export function detectPreviewType(filename: string): PreviewType {
  const ext = getExtension(filename)
  return PREVIEW_TYPE_MAP[ext] ?? 'none'
}

export function getMimeType(filename: string): string {
  const ext = getExtension(filename)
  return MIME_MAP[ext] ?? 'application/octet-stream'
}

export function getFileTypeLabel(filename: string): string {
  const ext = getExtension(filename)
  if (ext && FILE_TYPE_LABELS[ext]) return FILE_TYPE_LABELS[ext]
  if (ext) return ext.toUpperCase()
  return 'File'
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(i > 0 ? 1 : 0)} ${units[i]}`
}

export function formatDate(isoString: string | null): string {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export function getFileIcon(filename: string, isDir: boolean): string {
  if (isDir) return '📁'
  const type = detectPreviewType(filename)
  switch (type) {
    case 'image': return '🖼️'
    case 'text': return '📄'
    case 'pdf': return '📕'
    case 'audio': return '🎵'
    case 'video': return '🎬'
    default: return '📦'
  }
}
