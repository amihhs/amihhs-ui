<script setup lang='ts'>
import 'highlight.js/styles/atom-one-dark.css'
import { createCodeHtml } from '~/shared'

const props = withDefaults(defineProps<{
  language: string
  code?: string
  trim?: boolean
}>(), {
  code: '',
  trim: true,
})

const codeRef = ref<HTMLElement | null>(null)

const showCode = computed(() => props.code && props.code.trim())
const highlightCode = computed(() => createCodeHtml(props.language, showCode.value, props.trim))
const lineNumbers = computed(() => {
  let number = 1
  const numbers: number[] = []
  let lastIsLineWrap = false

  for (const char of showCode.value) {
    if (char === '\n') {
      lastIsLineWrap = true
      numbers.push(number++)
    }
    else {
      lastIsLineWrap = false
    }
  }
  if (!lastIsLineWrap)
    numbers.push(number++)

  return numbers.join('\n')
})
</script>

<template>
  <div class="bg-slate-8 p-3">
    <code ref="codeRef" class="flex">
      <pre class="whitespace-pre-line mr-sm text-right select-none dark:text-slate-5">
        {{ lineNumbers }}
      </pre>
      <pre class="__code text-[#d19a66]" v-html="highlightCode" />
    </code>
  </div>
</template>
