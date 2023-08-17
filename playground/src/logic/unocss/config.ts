import type { UserConfig } from '@unocss/core'
import lzString from 'lz-string'
import { isClient } from '@vueuse/core'
import { evaluateUserConfig } from './shared'
import defaultConfigRaw from './defaultConfig.ts?raw'

const { decompressFromEncodedURIComponent: decode, compressToEncodedURIComponent: encode } = lzString
export const STORAGE_KEY = 'unocss:config'
export const customCSSLayerName = 'playground'
const params = isClient ? new URLSearchParams(window.location.search || localStorage.getItem(STORAGE_KEY) || '') : new URLSearchParams('')

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
