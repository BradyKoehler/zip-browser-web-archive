<script setup lang="ts">
import type { FileEntry } from '../../types'
import { formatSize, getFileTypeLabel } from '../../lib/file-utils'

defineProps<{ entry: FileEntry }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="text-5xl mb-4">📦</div>
    <p class="text-zinc-700 dark:text-zinc-300 font-medium mb-1">No preview available</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
      {{ getFileTypeLabel(entry.name) }} · {{ formatSize(entry.size) }}
    </p>
    <p class="text-xs text-zinc-400 dark:text-zinc-500">Use the Download button to save this file.</p>
  </div>
</template>
