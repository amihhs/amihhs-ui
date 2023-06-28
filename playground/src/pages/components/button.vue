<script setup lang='ts'>
const sandbox = {
  files: {
    'main.ts': '',
    'index.html': '',
    'style.css': '',
    'tsconfig.json': '',
  },
}
</script>

<template>
  <Playground :sandbox="sandbox" />
</template>
