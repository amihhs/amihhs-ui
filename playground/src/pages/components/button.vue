<script setup lang='ts'>
const [template] = buttonComponentDefine({
  css: {
    presets: [
      ['.primary', 'text-white bg-blue-5'],
    ],
  },
  slots: { icon: true, loading: true },
})
</script>

<template>
  <Playground :template="template" />
</template>
