<script setup lang='ts'>
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js'

const props = withDefaults(defineProps<{
  language: string
  code?: string
  trim?: boolean
}>(), {
  code: '',
  trim: true,
})

function createCodeHtml(language: string, code: string, trim: boolean): string | null {
  if (!hljs)
    return null

  if (!(language && hljs.getLanguage(language)))
    return null

  return hljs.highlight(trim ? code.trim() : code, {
    language,
  }).value
}

const codeRef = ref<HTMLElement | null>(null)

const showCode = computed(() => {
  return props.code && props.code.trim()
})
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
const highlightCode = computed(() => {
  return createCodeHtml(props.language, showCode.value, props.trim)
})
</script>

<template>
  <div class="bg-slate-8 p-3">
    <code ref="codeRef" class="flex">
      <pre class="whitespace-pre-line mr-sm text-right">
        {{ lineNumbers }}
      </pre>
      <pre class="__code" v-html="highlightCode" />
    </code>
  </div>
</template>

<style lang='scss' scoped>

</style>
