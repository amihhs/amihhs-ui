<script setup lang='ts'>
import h from '@components/button/src/basic/demo/size.html?raw'
import style from '@components/button/src/basic/demo/style.css?raw'
import type { DirMap } from 'vite-plugin-dirs/types'

// const e = await import('@components/button/src/basic/demo/size.html?raw')
// console.log(e.default)

const buttonDemo = import.meta.dirs(
  '../../../../../packages/components/button/src',
  { exhaustive: true },
)
const demos: Record<string, DirMap | null> = {}
if (buttonDemo.children) {
  for (const item of buttonDemo.children) {
    const name = item.name
    demos[name] = item.children?.filter(v => v.name === 'demo') || null
  }
}

console.log(buttonDemo, demos)
const sandbox = {
  'index.html': h,
  'style.css': style,
}
</script>

<template>
  <Playground :sandbox="sandbox" />
</template>
