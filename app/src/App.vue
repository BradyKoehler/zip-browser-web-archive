<script setup lang="ts">
import { useZipArchive } from './composables/useZipArchive'
import AppHeader from './components/layout/AppHeader.vue'
import DropZone from './components/upload/DropZone.vue'
import PasswordPrompt from './components/shared/PasswordPrompt.vue'
import FileBrowser from './components/browser/FileBrowser.vue'
import PreviewModal from './components/preview/PreviewModal.vue'

const { entries, needsPassword, error } = useZipArchive()
</script>

<template>
  <div class="h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
    <AppHeader />

    <!-- Main content -->
    <DropZone v-if="entries.length === 0 && !needsPassword" />
    <FileBrowser v-else-if="entries.length > 0" />

    <!-- Password prompt overlay -->
    <PasswordPrompt v-if="needsPassword" />

    <!-- Preview modal overlay -->
    <PreviewModal />

    <!-- Global error toast -->
    <div v-if="error && entries.length > 0" class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
      {{ error }}
    </div>
  </div>
</template>
