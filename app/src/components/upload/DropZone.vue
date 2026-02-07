<script setup lang="ts">
import { ref } from 'vue'
import { useZipArchive } from '../../composables/useZipArchive'

const { openZip, loading, error } = useZipArchive()
const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function handleDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) openZip(file)
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) openZip(file)
}

function triggerFileInput() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center p-8">
    <div
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      class="w-full max-w-lg border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
      :class="[
        dragging
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
          : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
      ]"
    >
      <div v-if="loading" class="text-zinc-500 dark:text-zinc-400">
        <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-sm">Loading archive...</p>
      </div>
      <div v-else>
        <div class="text-4xl mb-4">📦</div>
        <p class="text-zinc-700 dark:text-zinc-300 font-medium mb-1">Drop a zip file here</p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">or click to browse</p>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".zip"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
    <p v-if="error" class="mt-4 text-sm text-red-500 dark:text-red-400 text-center absolute bottom-8">
      {{ error }}
    </p>
  </div>
</template>
