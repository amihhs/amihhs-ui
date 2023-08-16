<script setup lang="ts">
const color = useColorMode()
function toggleDark() {
  const newTheme = color.value === 'dark' ? 'light' : 'dark'
  color.value = newTheme
}
</script>

<template>
  <button class="!outline-none text-5" @click="toggleDark">
    <div class="dark:i-carbon-moon i-carbon-sun" />
  </button>
</template>
