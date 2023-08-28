<script setup lang='ts'>
import DEMOS from 'virtual:files-loader'
import type { FilesLoaderDir, FilesLoaderFile } from 'vite-plugin-files-loader'
import type { ComponentDemo } from '~/logic/sandbox'
import { generateSandboxContent, removeSortNumber } from '~/logic/sandbox'

const route = useRoute()
const componentName = computed(() => route.params.name)
const demos = ref<Record<string, FilesLoaderFile[]>>({})
const sandboxes = ref<ComponentDemo[]>([])

function getDemos() {
  const demos: Record<string, FilesLoaderFile[]> = {}
  const itemDemos = DEMOS.__default.filter(v => v.name === componentName.value)[0] as FilesLoaderDir
  if (!itemDemos)
    return demos

  for (const item of itemDemos.children.filter(v => v.type === 'directory')) {
    if (item.type !== 'directory' || item.children.length === 0)
      continue

    demos[item.name] = item.children.filter(v => v.name !== 'README.yaml' && v.type === 'file') as FilesLoaderFile[]

    const yaml = item.children.filter(v => v.name === 'README.yaml')[0] as FilesLoaderFile
    yaml && demos[item.name].push(yaml)
  }
  return demos
}

const watchStop = watch(componentName, async () => {
  demos.value = getDemos()
  sandboxes.value = await generateSandboxContent(demos.value)

  // console.log('sandboxes', sandboxes.value, demos)
}, { immediate: true })
onUnmounted(watchStop)
</script>

<template>
  <div>
    <template v-if="Object.keys(demos).length">
      <div v-for="item in sandboxes" :key="item.name" class="mb-6xl">
        <h2 class="capitalize font-bold text-3xl mb-lg">
          {{ item.yaml.Title || removeSortNumber(item.name) }}
        </h2>
        <div class="mb-lg text-lg text-slate-8">
          <div v-html="item.yaml.Description" />
          <div class="my-lg">
            <CompositionDetails :required="item.yaml.Required" />
          </div>
        </div>
        <Playground :sandbox="item.sandbox" :language="item.type" />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center h-50vh">
        <div class="text-4xl font-bold text-slate-8">
          No Found Component
        </div>
      </div>
    </template>
  </div>
</template>
