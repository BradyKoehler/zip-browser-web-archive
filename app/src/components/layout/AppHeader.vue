<script setup lang="ts">
import { useZipArchive } from '../../composables/useZipArchive'
import { useNavigation } from '../../composables/useNavigation'

const { fileName, hasArchive, closeArchive } = useZipArchive()
const { reset } = useNavigation()

function handleClose() {
  reset()
  closeArchive()
}
</script>

<template>
  <header class="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Zip Browser</h1>
      <span v-if="fileName" class="text-sm text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
        {{ fileName }}
      </span>
    </div>
    <button
      v-if="hasArchive()"
      @click="handleClose"
      class="text-sm px-3 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      Close
    </button>
  </header>
</template>
