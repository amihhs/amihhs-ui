<script setup lang='ts'>
const props = withDefaults(defineProps<{
  loading?: boolean
  iconClass?: string | string[] | Record<string, boolean>
  loadingClass?: string | string[] | Record<string, boolean>
  type?: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'default'
  size?: 'large' | 'medium' | 'small' | 'mini'
  category?: 'default' | 'secondary' | 'tertiary' | 'ghost' | 'dashed' | 'text'
}>(), {
  loading: false,
  iconClass: '',
  loadingClass: 'i-mingcute:loading-fill animate-spin text-1em mr-0.1em',
})
</script>

<template>
  <button class="">
    <template v-if="!props.loading && props.iconClass">
      <slot name="icon">
        <i :class="props.iconClass" />
      </slot>
    </template>
    <template v-else-if="props.loading">
      <slot name="loading">
        <i :class="props.loadingClass" />
      </slot>
    </template>
    <slot />
  </button>
</template>

<style scoped>
.primary {
  --uno: bg-blue-5 text-white;
}
.warning {
  --uno: bg-blue-5 text-white;
}
.danger {
  --uno: bg-blue-5 text-white;
}
.success {
  --uno: bg-blue-5 text-white;
}
.info {
  --uno: bg-blue-5 text-white;
}
.default {
  --uno: bg-blue-5 text-white;
}
</style>
