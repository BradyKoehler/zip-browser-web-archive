<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useFilePreview } from '../../composables/useFilePreview'
import { formatSize, getFileTypeLabel } from '../../lib/file-utils'
import ImagePreview from './ImagePreview.vue'
import TextPreview from './TextPreview.vue'
import PdfPreview from './PdfPreview.vue'
import MediaPreview from './MediaPreview.vue'
import FallbackPreview from './FallbackPreview.vue'

const { previewState, closePreview, downloadFile } = useFilePreview()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePreview()
}

function handleDownload() {
  if (previewState.entry) downloadFile(previewState.entry)
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div
    v-if="previewState.entry"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closePreview"
  >
    <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div class="flex items-center gap-3 min-w-0">
          <h3 class="font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {{ previewState.entry.name.split('/').pop() }}
          </h3>
          <span class="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
            {{ formatSize(previewState.entry.size) }} · {{ getFileTypeLabel(previewState.entry.name) }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="handleDownload"
            class="text-xs px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Download
          </button>
          <button
            @click="closePreview"
            class="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto">
        <div v-if="previewState.loading" class="flex items-center justify-center py-16">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <div v-else-if="previewState.error" class="flex items-center justify-center py-16 text-red-500 dark:text-red-400 text-sm">
          {{ previewState.error }}
        </div>
        <template v-else>
          <ImagePreview v-if="previewState.type === 'image'" :url="previewState.blobUrl!" />
          <TextPreview v-else-if="previewState.type === 'text'" :content="previewState.textContent!" :filename="previewState.entry!.name" />
          <PdfPreview v-else-if="previewState.type === 'pdf'" :url="previewState.blobUrl!" />
          <MediaPreview v-else-if="previewState.type === 'audio' || previewState.type === 'video'" :url="previewState.blobUrl!" :type="previewState.type" :filename="previewState.entry!.name" />
          <FallbackPreview v-else :entry="previewState.entry!" />
        </template>
      </div>
    </div>
  </div>
</template>
