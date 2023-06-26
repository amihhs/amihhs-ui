<script setup lang='ts'>
const props = withDefaults(defineProps<{
  loading?: boolean
  iconClass?: string | string[] | Record<string, boolean>
  loadingClass?: string | string[] | Record<string, boolean>
  type?: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'default'
  size?: 'large' | 'medium' | 'small' | 'mini'
}>(), {
  loading: false,
  iconClass: 'i-icon-park-solid:check-one mr-1em',
  loadingClass: 'i-mingcute:loading-fill animate-spin text-1em mr-1em',
})
</script>

<template>
  <button class="">
    <template v-if="!props.loading">
      <slot name="icon">
        <i :class="props.iconClass" />
      </slot>
    </template>
    <template v-else>
      <slot name="loading">
        <i :class="props.loadingClass" />
      </slot>
    </template>
    <slot />
  </button>
</template>

<style lang='scss' scoped>
.large {
  --uno: text-3xl px-3xl py-2 rounded-lg;
}
.primary {
  --uno: bg-primary-1 text-white;
}
.primary {
  --uno: bg-primary-1 text-white;
}
</style>
