<script setup lang='ts'>
import DEMOS from 'virtual:files-loader'
import type { FilesLoaderDir, FilesLoaderFile } from 'vite-plugin-files-loader'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { resolveImportPaths } from 'vite-plugin-files-loader/shared'
import type { ComponentDemo } from '~/logic/sandbox'
import { generateSandboxContent, removeSortNumber } from '~/logic/sandbox'

const route = useRoute()
const componentName = computed(() => route.params.name)
const demos = ref<Record<string, FilesLoaderFile[]>>({})
const sandboxes = ref<ComponentDemo[]>([])

async function getDemos() {
  const demos: Record<string, FilesLoaderFile[]> = {}
  const resolveDemos = (await resolveImportPaths(DEMOS)) as Record<string, FilesLoaderFile[]>
  const itemDemos = resolveDemos.__default.filter(v => v.name === componentName.value)[0] as unknown as FilesLoaderDir
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

const loading = ref(false)
const watchStop = watch(componentName, async () => {
  loading.value = true
  demos.value = await getDemos()
  sandboxes.value = await generateSandboxContent(demos.value)
  loading.value = false

  // console.log('sandboxes', sandboxes.value, demos)
}, { immediate: true })
onUnmounted(watchStop)
</script>

<template>
  <div>
    <div v-if="loading" class="text-center text-6 font-bold font-mono">
      loading...
    </div>
    <template v-else-if="Object.keys(demos).length">
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
