<script setup lang="ts">
import { ref } from 'vue'
import { useZipArchive } from '../../composables/useZipArchive'

const { unlockWithPassword, error } = useZipArchive()
const pw = ref('')
const submitting = ref(false)

async function handleSubmit() {
  if (!pw.value) return
  submitting.value = true
  await unlockWithPassword(pw.value)
  submitting.value = false
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6 w-full max-w-sm">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Password Required</h2>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">This archive is encrypted. Enter the password to continue.</p>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="pw"
          type="password"
          placeholder="Enter password..."
          autofocus
          class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <p v-if="error" class="text-sm text-red-500 dark:text-red-400 mb-3">{{ error }}</p>
        <button
          type="submit"
          :disabled="!pw || submitting"
          class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {{ submitting ? 'Unlocking...' : 'Unlock' }}
        </button>
      </form>
    </div>
  </div>
</template>
