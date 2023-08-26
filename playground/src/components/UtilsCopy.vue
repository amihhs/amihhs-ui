<script setup lang='ts'>
import { useClipboard } from '@vueuse/core'

const props = withDefaults(defineProps<{
  content: string | undefined
}>(), {
  content: '',
})

const {
  copy,
  copied,
  isSupported,
} = useClipboard({ source: props.content })
</script>

<template>
  <span v-if="isSupported" class="p-2 text-3 bg-slate-1 bg-opacity-10 rounded-md select-none">
    <button v-if="copied" class="text-green-5">Copied</button>
    <button v-else class="" @click="copy(props.content)">
      Copy
    </button>
  </span>
</template>
