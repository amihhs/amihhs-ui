<script setup lang='ts'>
import BUTTON_DEMOS from 'virtual:files-loader/button'
import type { FilesLoaderDir, FilesLoaderFile } from 'vite-plugin-files-loader'
import { generateSandboxContent } from '~/logic/sandbox'

// console.log('BUTTON_DEMOS', BUTTON_DEMOS)
const demos: Record<string, FilesLoaderFile[]> = {}
for (const item of BUTTON_DEMOS.children) {
  if (item.type !== 'directory' || item.children.length === 0)
    continue
  const demoDir = item.children.filter(v => v.name === 'demo')[0] as FilesLoaderDir
  demos[item.name] = demoDir.children as FilesLoaderFile[]
}

// console.log('demos', demos)
const sandboxes = ref<{ name: string; sandbox: Record<string, string> }[]>([])

sandboxes.value = await generateSandboxContent(demos)
</script>

<template>
  <div>
    <div v-for="item in sandboxes" :key="item.name">
      <h2 class="capitalize font-bold text-4xl mb-lg">
        {{ item.name }}
      </h2>
      <Playground :sandbox="item.sandbox" />
    </div>
  </div>
</template>
