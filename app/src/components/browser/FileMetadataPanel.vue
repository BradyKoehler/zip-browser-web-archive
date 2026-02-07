<script setup lang="ts">
import type { FileMetadataDetail } from '../../types'
import { formatSize } from '../../lib/file-utils'

defineProps<{ metadata: FileMetadataDetail }>()
</script>

<template>
  <div class="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 px-8 py-3">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">Compressed</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ formatSize(metadata.compressedSize) }}</p>
      </div>
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">Uncompressed</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ formatSize(metadata.size) }}</p>
      </div>
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">Ratio</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ metadata.size > 0 ? (metadata.compressionRatio * 100).toFixed(1) + '%' : '—' }}</p>
      </div>
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">Method</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ metadata.compressionMethod }}</p>
      </div>
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">CRC32</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ metadata.crc32.toString(16).padStart(8, '0').toUpperCase() }}</p>
      </div>
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">Encrypted</span>
        <p class="text-zinc-700 dark:text-zinc-300">{{ metadata.encrypted ? 'Yes' : 'No' }}</p>
      </div>
      <div v-if="metadata.unixMode !== null && metadata.unixMode !== undefined">
        <span class="text-zinc-400 dark:text-zinc-500">Unix Mode</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ metadata.unixMode.toString(8).padStart(4, '0') }}</p>
      </div>
      <div>
        <span class="text-zinc-400 dark:text-zinc-500">Header Offset</span>
        <p class="text-zinc-700 dark:text-zinc-300 font-mono">{{ metadata.headerStart }}</p>
      </div>
      <div v-if="metadata.comment" class="col-span-full">
        <span class="text-zinc-400 dark:text-zinc-500">Comment</span>
        <p class="text-zinc-700 dark:text-zinc-300">{{ metadata.comment }}</p>
      </div>
    </div>
  </div>
</template>
