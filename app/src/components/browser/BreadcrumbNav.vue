<script setup lang="ts">
import { useNavigation } from '../../composables/useNavigation'

const { breadcrumbs, navigateTo } = useNavigation()
</script>

<template>
  <nav class="flex items-center gap-1 text-sm px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 overflow-x-auto">
    <template v-for="(crumb, i) in breadcrumbs" :key="crumb.path">
      <span v-if="i > 0" class="text-zinc-400">/</span>
      <button
        @click="navigateTo(crumb.path)"
        class="px-1.5 py-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
        :class="i === breadcrumbs.length - 1
          ? 'text-zinc-900 dark:text-zinc-100 font-medium'
          : 'text-zinc-500 dark:text-zinc-400'"
      >
        {{ crumb.name }}
      </button>
    </template>
  </nav>
</template>
