<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { createSandbox } from '../logic/sandbox'
import h from '../../../packages/components/button/src/basic/demo/index.html?raw'
import style from '../../../packages/components/button/src/basic/demo/style.css?raw'

const props = withDefaults(defineProps<{
  sandbox: any
}>(), {})
console.log('props', props)
const { sandboxContainerRef, addFiles } = createSandbox()
onMounted(() => {
  console.log('mounted', h)
  addFiles({
    'index.html': h,
    'style.css': style,
  })
})
</script>

<template>
  <div>
    <div ref="sandboxContainerRef" />
  </div>
</template>
