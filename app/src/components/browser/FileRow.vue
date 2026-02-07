<script setup lang="ts">
import { ref } from 'vue'
import type { DirectoryEntry, FileMetadataDetail } from '../../types'
import { formatSize, formatDate, getFileTypeLabel, getFileIcon } from '../../lib/file-utils'
import { useNavigation } from '../../composables/useNavigation'
import { useFilePreview } from '../../composables/useFilePreview'
import { useZipArchive } from '../../composables/useZipArchive'
import FileMetadataPanel from './FileMetadataPanel.vue'

const props = defineProps<{ entry: DirectoryEntry }>()
const { navigateTo } = useNavigation()
const { openPreview, downloadFile } = useFilePreview()
const { getMetadata } = useZipArchive()

const expanded = ref(false)
const metadata = ref<FileMetadataDetail | null>(null)

function handleClick() {
  if (props.entry.isDir) {
    navigateTo(props.entry.fullPath)
  } else if (props.entry.entry) {
    openPreview(props.entry.entry)
  }
}

function handleDownload(e: Event) {
  e.stopPropagation()
  if (props.entry.entry && !props.entry.isDir) {
    downloadFile(props.entry.entry)
  }
}

function toggleExpand(e: Event) {
  e.stopPropagation()
  if (!expanded.value && props.entry.entry) {
    metadata.value = getMetadata(props.entry.entry.index) as FileMetadataDetail | null
  }
  expanded.value = !expanded.value
}
</script>

<template>
  <div>
    <div
      @click="handleClick"
      class="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 items-center px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 text-sm"
    >
      <!-- Icon -->
      <span class="text-base w-6 text-center">{{ getFileIcon(entry.name, entry.isDir) }}</span>

      <!-- Name -->
      <span class="truncate font-medium text-zinc-900 dark:text-zinc-100" :class="entry.isDir ? 'text-blue-600 dark:text-blue-400' : ''">
        {{ entry.name }}
      </span>

      <!-- Size -->
      <span class="text-zinc-500 dark:text-zinc-400 text-xs tabular-nums w-20 text-right">
        {{ entry.isDir ? '—' : formatSize(entry.entry?.size ?? 0) }}
      </span>

      <!-- Type -->
      <span class="text-zinc-400 dark:text-zinc-500 text-xs w-24 text-right hidden sm:block">
        {{ entry.isDir ? 'Folder' : getFileTypeLabel(entry.name) }}
      </span>

      <!-- Modified -->
      <span class="text-zinc-400 dark:text-zinc-500 text-xs w-36 text-right hidden md:block">
        {{ formatDate(entry.entry?.lastModified ?? null) }}
      </span>

      <!-- Actions -->
      <div class="flex items-center gap-1 w-16 justify-end">
        <button
          v-if="!entry.isDir"
          @click="handleDownload"
          class="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Download"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
          </svg>
        </button>
        <button
          v-if="entry.entry"
          @click="toggleExpand"
          class="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Details"
        >
          <svg class="w-4 h-4 transition-transform" :class="expanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Expanded metadata -->
    <FileMetadataPanel v-if="expanded && metadata" :metadata="metadata" />
  </div>
</template>
