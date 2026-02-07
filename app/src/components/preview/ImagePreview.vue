<script setup lang="ts">
defineProps<{ url: string }>()
</script>

<template>
  <div class="flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-800 min-h-[200px]">
    <img :src="url" class="max-w-full max-h-[70vh] object-contain rounded" />
  </div>
</template>
