<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ content: string; filename: string }>()

const lineCount = ref(0)

watch(() => props.content, (val) => {
  lineCount.value = val.split('\n').length
}, { immediate: true })
</script>

<template>
  <div class="overflow-auto max-h-[70vh] bg-zinc-950 text-zinc-100">
    <div class="flex text-xs font-mono leading-relaxed">
      <!-- Line numbers -->
      <div class="py-4 pl-4 pr-3 text-right select-none text-zinc-600 border-r border-zinc-800 shrink-0">
        <div v-for="n in lineCount" :key="n">{{ n }}</div>
      </div>
      <!-- Code content -->
      <pre class="py-4 px-4 overflow-x-auto flex-1"><code>{{ content }}</code></pre>
    </div>
  </div>
</template>
