<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { createSandbox } from '~/logic/sandbox'
import { getFileType } from '~/shared'

const props = withDefaults(defineProps<{
  sandbox: Record<string, string>
}>(), {})

const {
  uuid,
  sandboxContainerRef,
  files,
  addFiles,
} = createSandbox()

const showType = ref<string>('preview')
const switchMenu = {
  preview: { icon: 'i-material-symbols:eyeglasses-rounded mr-2', text: 'preview' },
  code: { icon: 'i-material-symbols:code-rounded mr-2', text: 'code' },
  all: { icon: 'i-material-symbols:call-to-action-outline mr-2', text: 'all' },
}

const showName = ref(props.sandbox ? Object.keys(props.sandbox)[0] : '')
const code = computed(() => files.get(showName.value))
function changeShowName(name: string) {
  showName.value = name
}

onMounted(() => {
  // console.log('mounted', h)
  addFiles(props.sandbox)
  window.addEventListener('message', (e) => {
    const data = e.data
    if (data.type === 'sandbox-height' && data.uuid === uuid.value && sandboxContainerRef.value)
      sandboxContainerRef.value.style.height = `${data.height}px`
  })
})
</script>

<template>
  <div>
    <div class="tools">
      <div
        class="bg-slate-6 inline-flex items-center rounded-lg p-1"
        dark="bg-slate-9"
      >
        <button
          v-for="v in switchMenu" :key="v.text"
          class="switch-btn"
          :class="{ 'switch-active': showType === v.text }"
          @click="showType = v.text"
        >
          <span :class="v.icon" />
          <span>{{ v.text }}</span>
        </button>
      </div>
    </div>
    <div
      class="border-(2 slate-2) rounded-xl overflow-hidden mt-sm"
      dark="border-slate-7"
    >
      <div v-show="['preview', 'all'].includes(showType)" ref="sandboxContainerRef" class="m-sm" />
      <div v-show="['code', 'all'].includes(showType)">
        <div
          class="flex items-center border-(b-1 slate-6) font-mono text-sm bg-slate-8 overflow-x-auto scrollbar-default"
          dark="bg-slate-9"
        >
          <div
            v-for="[name] in files" :key="name"
            class="cursor-pointer p-2 border-b-3"
            :class="[showName === name
              ? 'text-slate-3 border-slate-1 dark-(text-slate-4 border-slate-4) font-bold'
              : 'border-transparent text-slate-5 dark:text-slate-6']"
            @click="changeShowName(name)"
          >
            {{ name }}
          </div>
        </div>
        <PreviewCode :language="getFileType(showName)" :code="code" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.switch-btn {
  --uno: capitalize font-bold px-lg py-2 text-white rounded-lg;
}
.switch-active {
  --uno: bg-slate-8;
}
</style>
