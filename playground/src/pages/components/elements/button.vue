<script setup lang='ts'>
import BUTTON_DEMOS from 'virtual:files-loader/button'
import type { FilesLoaderDir, FilesLoaderFile } from 'vite-plugin-files-loader'

// eslint-disable-next-line no-console
console.log('BUTTON_DEMOS', BUTTON_DEMOS)

const demos: Record<string, FilesLoaderFile[]> = {}
for (const item of BUTTON_DEMOS.children) {
  if (!(item as FilesLoaderDir).children)
    continue
  const demoDir = (item as FilesLoaderDir).children.filter(v => v.name === 'demo')[0] as FilesLoaderDir
  demos[item.name] = demoDir.children as FilesLoaderFile[]
}

// console.log('demos', demos)
const sandboxes = reactive<{ name: string; sandbox: Record<string, string> }[]>([])
async function generateSandboxContent() {
  for (const name in demos) {
    const files = demos[name]?.filter(v => v.content) || []
    const sandbox: Record<string, string> = {}
    for (const file of files) {
      // console.log(`${filePrefix}/${name}/demo/${file.name}?raw`)
      sandbox[file.name] = file.content
    }

    sandboxes.push({
      name,
      sandbox,
    })
  }
}

// const sandbox = {
//   'index.html': h,
//   'style.css': style,
// }

await generateSandboxContent()
</script>

<template>
  <div>
    <div v-for="item in sandboxes" :key="item.name">
      <h2 class="capitalize">
        {{ item.name }}
      </h2>
      <Playground :sandbox="item.sandbox" />
    </div>
  </div>
</template>
