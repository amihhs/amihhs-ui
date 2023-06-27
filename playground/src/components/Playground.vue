<script setup lang='ts'>
import 'splitpanes/dist/splitpanes.css'
import '@vue/repl/style.css'
import { breakpointsTailwind } from '@vueuse/core'
import { version } from 'vue'
import { Preview, Repl, ReplStore } from '@vue/repl'
import resetCss from '@unocss/reset/tailwind.css?raw'

// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'

// @ts-expect-error missing types
import Monaco from '@vue/repl/monaco-editor'
import { logicUno } from '../logic/unocss'
import { generateAppTemplate, generatePlaygroundTemplate } from '../logic/vue'

const props = withDefaults(defineProps<{
  template: string
}>(), {})
const bp = useBreakpoints(breakpointsTailwind)
const isMobile = bp.smaller('sm')
const type = ref<'preview' | 'editor'>('preview')

const store = new ReplStore()
store.setVueVersion(version)
const { output } = logicUno(toRef(props, 'template'))
const previewOptions = reactive({
  headHTML: '',
  bodyHTML: '',
  customCode: {
    importCode: '',
    useCode: '',
  },
})

provide('store', store)
provide('clear-console', ref(false))
provide('preview-options', previewOptions)
throttledWatch([output, toRef(props, 'template')], () => {
  store.setFiles({
    'reset.css': resetCss || '',
    'App.vue': generateAppTemplate(),
    'Playground.vue': generatePlaygroundTemplate(output.value?.css || ''),
    'TheButton.vue': props.template,
  })
  store.state.resetFlip = !store.state.resetFlip
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <button class="px-3 rounded-t-md border-(1 slate-1)" :class="{ 'bg-slate-1': type === 'preview' }" @click="type = 'preview'">
        preview
      </button>
      <button class="px-3 rounded-t-md border-(1 slate-1)" :class="{ 'bg-slate-1': type === 'editor' }" @click="type = 'editor'">
        editor
      </button>
    </div>
    <Splitpanes
      v-if="type === 'preview'"
      class="p-3 border-(1 slate-2) rounded-md w-full h-full items-stretch"
      :horizontal="isMobile"
    >
      <Pane>
        <Preview show />
      </Pane>
      <Pane class="setting flex-grow shadow-md rounded-md p-3 border-(1 slate-1)">
        <div>
          <h2 font-bold text-lg>
            setting
          </h2>
        </div>
      </Pane>
    </Splitpanes>
    <div v-else-if="type === 'editor'" h-100vh>
      <Repl :store="store" :clear-console="false" :editor="Monaco" :show-compile-output="false" />
    </div>
  </div>
</template>

<style scoped>
:deep(.splitpanes__splitter){
  --uno: relative;
  --uno: before:(content-[''] w-2 h-full absolute top-0 left-0 bg-gray-2 bg-opacity-60 cursor-col-resize hidden hover:block);
}
</style>
