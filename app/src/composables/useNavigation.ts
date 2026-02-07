import { ref, computed, readonly } from 'vue'
import { useZipArchive } from './useZipArchive'
import type { DirectoryEntry } from '../types'

const currentPath = ref('')
const sortField = ref<'name' | 'size' | 'lastModified'>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

export function useNavigation() {
  const { entries } = useZipArchive()

  const breadcrumbs = computed(() => {
    const crumbs = [{ name: 'Root', path: '' }]
    if (!currentPath.value) return crumbs
    const parts = currentPath.value.replace(/\/$/, '').split('/')
    let accumulated = ''
    for (const part of parts) {
      accumulated += part + '/'
      crumbs.push({ name: part, path: accumulated })
    }
    return crumbs
  })

  const currentEntries = computed<DirectoryEntry[]>(() => {
    const prefix = currentPath.value
    const seen = new Set<string>()
    const result: DirectoryEntry[] = []

    for (const entry of entries.value) {
      if (!entry.name.startsWith(prefix)) continue
      const rest = entry.name.slice(prefix.length)
      if (!rest || rest === '/') continue

      const slashIndex = rest.indexOf('/')
      if (slashIndex === -1) {
        // Direct file child
        result.push({
          name: rest,
          fullPath: entry.name,
          isDir: false,
          entry,
        })
      } else {
        // Subdirectory
        const dirName = rest.slice(0, slashIndex)
        if (!seen.has(dirName)) {
          seen.add(dirName)
          // Try to find an explicit directory entry
          const dirEntry = entries.value.find(
            e => e.name === prefix + dirName + '/' && e.isDir
          )
          result.push({
            name: dirName,
            fullPath: prefix + dirName + '/',
            isDir: true,
            entry: dirEntry,
          })
        }
      }
    }

    // Sort: directories first, then by selected field
    return result.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
      const dir = sortDirection.value === 'asc' ? 1 : -1
      switch (sortField.value) {
        case 'size':
          return ((a.entry?.size ?? 0) - (b.entry?.size ?? 0)) * dir
        case 'lastModified': {
          const aDate = a.entry?.lastModified ?? ''
          const bDate = b.entry?.lastModified ?? ''
          return aDate.localeCompare(bDate) * dir
        }
        default:
          return a.name.localeCompare(b.name) * dir
      }
    })
  })

  function navigateTo(path: string) {
    currentPath.value = path
  }

  function navigateUp() {
    const parts = currentPath.value.replace(/\/$/, '').split('/')
    parts.pop()
    currentPath.value = parts.length > 0 ? parts.join('/') + '/' : ''
  }

  function toggleSort(field: typeof sortField.value) {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  function reset() {
    currentPath.value = ''
    sortField.value = 'name'
    sortDirection.value = 'asc'
  }

  return {
    currentPath: readonly(currentPath),
    breadcrumbs,
    currentEntries,
    sortField: readonly(sortField),
    sortDirection: readonly(sortDirection),
    navigateTo,
    navigateUp,
    toggleSort,
    reset,
  }
}
