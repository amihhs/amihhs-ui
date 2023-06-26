import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type SelectorPresets = [string, string][]

/**
 * @description style options
 */
export interface GenerateStyleCodeOptions {
  lang?: 'css' | 'scss' | 'less'
  applyVariableKey?: string
  scoped?: boolean
  /**
   *
   * @description style selector presets
   * @example
   * [['.large', 'text-2xl px-3xl py-2 rounded-lg'], ['#id', 'color: red;']]
   *
   */
  presets?: SelectorPresets
}

export interface GeneratePropsCodeOptions {
  type: 'withDefaults' | 'defineProps'
  props: {
    [key: string]: [boolean, string, unknown] // [isRequired, type, default]
  }
}
