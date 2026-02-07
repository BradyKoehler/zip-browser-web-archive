<script setup lang="ts">
defineProps<{ url: string }>()
</script>

<template>
  <iframe :src="url" class="w-full h-[70vh] border-0" />
</template>
