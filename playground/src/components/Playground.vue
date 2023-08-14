<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { createSandbox } from '../logic/sandbox'
import h from '../../../packages/components/button/src/basic/demo/size.html?raw'
import style from '../../../packages/components/button/src/basic/demo/style.css?raw'

const props = withDefaults(defineProps<{
  sandbox: any
}>(), {})
console.log('props', props)
const { sandboxContainerRef, addFiles } = createSandbox()
function iFrameHeight(ifmEl: HTMLIFrameElement) {
  const subWeb = ifmEl.contentDocument
  if (ifmEl != null && subWeb != null)
    return subWeb.body.scrollHeight
}

onMounted(() => {
  console.log('mounted', h)
  addFiles({
    'index.html': h,
    'style.css': style,
  })

  console.log('sandboxContainerRef', sandboxContainerRef.value)
  setTimeout(() => {
    const ifmEl = sandboxContainerRef.value?.getElementsByTagName('iframe')[0]
    console.log('a', ifmEl?.contentWindow, ifmEl?.contentDocument)
  }, 1000)
})
</script>

<template>
  <div>
    <div class="tools">
      <button>reset</button>
    </div>
    <div ref="sandboxContainerRef" />
    <PreviewCode language="html" :code="h" />
  </div>
</template>
