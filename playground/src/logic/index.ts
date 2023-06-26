/* eslint-disable @typescript-eslint/quotes */
import { compile } from 'vue'
import type { GeneratePropsCodeOptions, GenerateStyleCodeOptions } from '../types'
import { generateTemplateStyleCode } from './css'
import { generateTemplatePropsCode } from './define'

/**
 * 通过一些配置，生成满足要求的预设组件代码<defineComponent-tsx | defineComponent-h | template>
 */

export function buttonComponentDefine(config: {
  css?: GenerateStyleCodeOptions
  slots?: {
    icon?: boolean
    loading?: boolean
  }
  props?: {
    [key: string]: {
      value: GeneratePropsCodeOptions['props'][string]
      use: any
    }
  }
}) {
  const { css, props } = config
  const styleCode = generateTemplateStyleCode(css)

  const propsOptions: GeneratePropsCodeOptions['props'] = {}
  for (const key in props)
    propsOptions[key] = props[key].value

  const propsCode = generateTemplatePropsCode({
    type: 'withDefaults',
    props: {
      loading: [false, 'boolean', false],
      iconClass: [false, 'string | string[] | Record<string, boolean>', ''],
      loadingClass: [false, 'string | string[] | Record<string, boolean>', 'i-mingcute:loading-fill animate-spin text-1em mr-1em'],
      type: [false, `'primary' | 'warning' | 'danger' | 'success' | 'info' | 'default'`, 'default'],
      size: [false, `'large' | 'medium' | 'normal' | 'small' | 'mini'`, 'normal'],
      ...propsOptions,
    },
  })

  const template = `
  <script setup lang='ts'>
  ${propsCode}
  </script>

  <template>
    <button class="">
      <template v-if="!props.loading && props.iconClass">
        <slot name="icon">
          <i :class="props.iconClass" />
        </slot>
      </template>
      <template v-else-if="loading">
        <slot name="loading">
          <i :class="props.loadingClass" />
        </slot>
      </template>
      <slot />
    </button>
  </template>

  ${styleCode}
  `
  return [
    template,
    compile(template),
  ]
}
