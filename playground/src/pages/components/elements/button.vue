<script setup lang='ts'>
import type { DirMap } from 'vite-plugin-dirs'
import BUTTON_DEMOS from 'virtual:demo-loader/button'
import DEMOS from 'virtual:demo-loader'

// const e = await import('@components/button/src/basic/demo/size.html?raw')
// console.log(e.default)
// @components/button/src/basic/demo/secondary.html?raw

// eslint-disable-next-line no-console
console.log(BUTTON_DEMOS)
// eslint-disable-next-line no-console
console.log(DEMOS)

const buttonDemo = import.meta.dirs('../../../../../packages/components/button/src',
  { exhaustive: true },
)
const demos: Record<string, DirMap | null> = {}
if (buttonDemo.children) {
  for (const item of buttonDemo.children) {
    const name = item.name
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    demos[name] = item.children?.filter(v => v.name === 'demo')[0] || null
  }
}

// eslint-disable-next-line no-console
console.log(buttonDemo, demos)

const sandboxes = reactive<{ name: string; sandbox: Record<string, string> }[]>([])
// async function generateSandboxContent() {
//   for (const name in demos) {
//     const files = demos[name]?.children?.filter(v => v.type === 'file') || []
//     const sandbox: Record<string, string> = {}
//     for (const file of files) {
//       // console.log(`${filePrefix}/${name}/demo/${file.name}?raw`)
//       const content = await import(`${filePrefix}/${name}/demo/${file.name}?raw`)
//       sandbox[file.name] = content.default
//     }

//     sandboxes.push({
//       name,
//       sandbox,
//     })
//   }
// }

// const sandbox = {
//   'index.html': h,
//   'style.css': style,
// }

// await generateSandboxContent()
</script>

<template>
  <div>
    <div v-for="item in sandboxes" :key="item.name">
      <h2 class="capitalize">
        {{ item.name }}
      </h2>
      {{ item }}
      <!-- <Playground :sandbox="item.sandbox" /> -->
    </div>
  </div>
</template>
