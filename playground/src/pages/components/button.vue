<script setup lang='ts'>
const loading = ref(true)

const _button = buttonComponentDefine({
  css: {
    presets: [
      ['.primary', 'text-white bg-blue-5'],
    ],
  },
  slots: { icon: true, loading: true },
})
</script>

<template>
  <div class="flex items-center border-(1 slate-2) rounded-lg p-lg">
    <div class="w-1/3 flex-shrink-0 grid place-content-center">
      <button @click="loading = !loading">
        <template v-if="!loading">
          <slot name="icon">
            <i class="i-icon-park-solid:check-one" />
          </slot>
        </template>
        <template v-else>
          <slot name="loading">
            <i class="i-mingcute:loading-fill text-1em animate-spin" />
          </slot>
        </template>
        <slot />
        aa
      </button>
    </div>
    <div class="setting ml-3xl flex-grow shadow-md rounded-md p-3 border-(1 slate-1)">
      <h2 font-bold text-lg>
        setting
      </h2>
    </div>
  </div>
</template>
