<script setup lang='ts'>
import h from '../../../../packages/components/button/src/basic/demo/size.html?raw'
import style from '../../../../packages/components/button/src/basic/demo/style.css?raw'

const sandbox = {
  'index.html': h,
  'style.css': style,
}
</script>

<template>
  <Playground :sandbox="sandbox" />
</template>
