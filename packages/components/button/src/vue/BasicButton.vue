<script setup lang='ts'>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  loading?: boolean
  icon?: string | string[] | Record<string, boolean>
  loadingClass?: string | string[] | Record<string, boolean>
  type?: 'primary' | 'warning' | 'danger' | 'success' | 'default'
  size?: 'large' | 'medium' | 'small'
  category?: 'default' | 'secondary' | 'tertiary' | 'ghost' | 'dashed'
  raw?: boolean
}>(), {
  loading: false,
  icon: '',
  loadingClass: 'i-mingcute:loading-fill animate-spin text-1em -align-0.25em mr-0.1em',
  type: 'default',
  size: 'medium',
  category: 'default',
  raw: false,
})

const presets = {
  default: {
    primary: 'bg-blue-5 text-white',
    warning: 'bg-yellow-5 text-white',
    danger: 'bg-red-5 text-white',
    success: 'bg-green-5 text-white',
    default: 'bg-gray-2 text-gray-9',
  },
  secondary: {
    primary: 'bg-blue-2 text-blue-6',
    warning: 'bg-yellow-2 text-yellow-6',
    danger: 'bg-red-2 text-red-6',
    success: 'bg-green-2 text-green-6',
    default: 'bg-gray-2 text-gray-6',
  },
  tertiary: {
    primary: 'bg-gray-2 text-blue-6',
    warning: 'bg-gray-2 text-yellow-6',
    danger: 'bg-gray-2 text-red-6',
    success: 'bg-gray-2 text-green-6',
    default: 'bg-gray-2 text-gray-6',
  },
  ghost: {
    primary: 'bg-transparent text-blue-5 border-(2 blue-5)',
    warning: 'bg-transparent text-yellow-5 border-(2 yellow-5)',
    danger: 'bg-transparent text-red-5 border-(2 red-5)',
    success: 'bg-transparent text-green-5 border-(2 green-5)',
    default: 'bg-transparent text-gray-5 border-(2 gray-5)',
  },
  dashed: {
    primary: 'bg-transparent text-blue-5 border-(2 blue-5 dashed)',
    warning: 'bg-transparent text-yellow-5 border-(2 yellow-5 dashed)',
    danger: 'bg-transparent text-red-5 border-(2 red-5 dashed)',
    success: 'bg-transparent text-green-5 border-(2 green-5 dashed)',
    default: 'bg-transparent text-gray-5 border-(2 gray-5 dashed)',
  },
} as const

const sizePresets = {
  large: 'py-2 px-2xl text-lxl rounded-lg',
  medium: 'py-1 px-lg text-md rounded-md',
  small: 'py-0.5 px-3 text-3 rounded-md',
} as const

const presetClass = computed(() => {
  return props.raw ? '' : `${presets[props.category][props.type]} ${sizePresets[props.size]} ${props.loading ? 'cursor-not-allowed' : ''}`
})
</script>

<template>
  <button :class="presetClass">
    <template v-if="!props.loading && props.icon">
      <slot name="icon">
        <i :class="props.icon" />
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
