<script setup lang='ts'>
import 'splitpanes/dist/splitpanes.css'
import '@vue/repl/style.css'
import { version } from 'vue'
import { Preview, ReplStore } from '@vue/repl'
import { logicUno } from '../logic/unocss'

import { readSandBoxHeightScript } from '~/logic/sandbox'

const props = withDefaults(defineProps<{
  sandbox: Record<string, string>
  uuid: string
}>(), {})

const store = new ReplStore()
store.setVueVersion(version)
const { output } = logicUno(toRef(props, 'sandbox'))
const previewOptions = reactive({
  headHTML: readSandBoxHeightScript(props.uuid),
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
  <div class="h-full">
    <Preview show :ssr="false" />
  </div>
</template>

<style scoped>

</style>
