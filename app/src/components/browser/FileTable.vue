<script setup lang="ts">
import { useNavigation } from '../../composables/useNavigation'
import FileRow from './FileRow.vue'

const { currentEntries, sortField, sortDirection, toggleSort } = useNavigation()

function sortIcon(field: string): string {
  if (sortField.value !== field) return ''
  return sortDirection.value === 'asc' ? ' ↑' : ' ↓'
}
</script>

<template>
  <div class="flex-1 overflow-auto">
    <!-- Column headers -->
    <div class="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 items-center px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-xs font-medium text-zinc-500 dark:text-zinc-400 sticky top-0">
      <span class="w-6" />
      <button @click="toggleSort('name')" class="text-left hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
        Name{{ sortIcon('name') }}
      </button>
      <button @click="toggleSort('size')" class="w-20 text-right hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
        Size{{ sortIcon('size') }}
      </button>
      <span class="w-24 text-right hidden sm:block">Type</span>
      <button @click="toggleSort('lastModified')" class="w-36 text-right hidden md:block hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
        Modified{{ sortIcon('lastModified') }}
      </button>
      <span class="w-16" />
    </div>

    <!-- Empty state -->
    <div v-if="currentEntries.length === 0" class="flex items-center justify-center py-16 text-zinc-400 dark:text-zinc-500 text-sm">
      This directory is empty
    </div>

    <!-- File rows -->
    <FileRow
      v-for="entry in currentEntries"
      :key="entry.fullPath"
      :entry="entry"
    />
  </div>
</template>
