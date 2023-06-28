export function generateAppTemplate() {
  const App = `
<script setup>
import './reset.css'
import Playground from './Playground.vue'
</script>

<template>
  <Playground />
</template>
`

  return App
}

export function generatePlaygroundTemplate(style: string) {
  const SFC = `
<script setup>
import TheButton from './TheButton.vue'
</script>

<template>
  <TheButton :loading="true">TheButton</TheButton>
  <TheButton class="primary">TheButton</TheButton>
</template>

<style>
${style}
</style>
`

  return SFC
}
