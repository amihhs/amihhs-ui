import type { UserConfig } from '@unocss/core'
import { decompressFromEncodedURIComponent as decode, compressToEncodedURIComponent as encode } from 'lz-string'
import { evaluateUserConfig } from './shared'
import defaultConfigRaw from './defaultConfig.ts?raw'

export const STORAGE_KEY = 'unocss:config'
export const customCSSLayerName = 'playground'
const params = new URLSearchParams(window.location.search || localStorage.getItem(STORAGE_KEY) || '')

export const defaultConfig = ref<UserConfig | undefined>()
export const customConfigRaw = ref(decode(params.get('config') || '') || defaultConfigRaw)

export async function load() {
  try {
    defaultConfig.value = await evaluateUserConfig(defaultConfigRaw)
  }
  catch (e) {
    console.error(e)
  }
}

throttledWatch(
  [customConfigRaw],
  () => {
    localStorage.setItem(STORAGE_KEY, encode(customConfigRaw.value))
  },
  { throttle: 1000, deep: true },
)

load()
