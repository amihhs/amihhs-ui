export function generateAppTemplate() {
  const App = `
<script setup>
import './style.css'
import Demo from './Demo.vue'
</script>

<template>
  <Demo />
</template>
`

  return App
}
