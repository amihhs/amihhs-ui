<script setup lang='ts'>
import 'splitpanes/dist/splitpanes.css'
import '@vue/repl/style.css'
import { breakpointsTailwind } from '@vueuse/core'
import { version } from 'vue'
import { Preview, Repl, ReplStore } from '@vue/repl'

// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'

// @ts-expect-error missing types
import Monaco from '@vue/repl/monaco-editor'
import { logicUno } from '../logic/unocss'

const props = withDefaults(defineProps<{
  sandbox: Record<string, string>
}>(), {})
const bp = useBreakpoints(breakpointsTailwind)
const isMobile = bp.smaller('sm')
const type = ref<'preview' | 'editor'>('preview')

const store = new ReplStore()
store.setVueVersion(version)
const { output } = logicUno(toRef(props, 'sandbox'))
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
throttledWatch([output, toRef(props, 'sandbox')], () => {
  store.setFiles({
    ...props.sandbox,
  })
  store.state.resetFlip = !store.state.resetFlip
})
</script>

<template>
  <div>
    <Splitpanes
      v-if="type === 'preview'"
      class="p-3 rounded-md w-full h-full items-stretch"
      :horizontal="isMobile"
    >
      <Pane>
        <Preview show :ssr="false" />
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
