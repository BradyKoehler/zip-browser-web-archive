<script setup lang="ts">
import { getMimeType } from '../../lib/file-utils'

const props = defineProps<{ url: string; type: 'audio' | 'video'; filename: string }>()
const mimeType = getMimeType(props.filename)
</script>

<template>
  <div class="flex items-center justify-center p-8 bg-zinc-100 dark:bg-zinc-800">
    <video v-if="type === 'video'" controls class="max-w-full max-h-[70vh] rounded">
      <source :src="url" :type="mimeType" />
      Your browser does not support this video format.
    </video>
    <audio v-else controls class="w-full max-w-md">
      <source :src="url" :type="mimeType" />
      Your browser does not support this audio format.
    </audio>
  </div>
</template>
