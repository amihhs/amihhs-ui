import type { GenerateOptions, GenerateResult, UnoGenerator, UnocssPluginContext, UserConfig } from 'unocss'
import { createGenerator } from 'unocss'
import { createAutocomplete } from '@unocss/autocomplete'
import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import MagicString from 'magic-string'
import type { Ref } from 'vue'
import { customCSSLayerName, customConfigRaw, defaultConfig } from './config'
import { evaluateUserConfig } from './shared'

function useTransformer(uno: UnoGenerator<object>) {
  async function applyTransformers(code: MagicString, id: string, enforce?: 'pre' | 'post') {
    let { transformers } = uno.config
    transformers = (transformers ?? []).filter(i => i.enforce === enforce)

    if (!transformers.length)
      return

    const fakePluginContext = { uno } as UnocssPluginContext
    for (const { idFilter, transform } of transformers) {
      if (idFilter && !idFilter(id))
        continue
      await transform(code, id, fakePluginContext)
    }
  }

  async function getTransformedHTML(inputHTML: string, id = 'input.html') {
    const steps = ['pre', undefined, 'post'] as const

    let input = new MagicString(inputHTML)
    for (const step of steps) {
      await applyTransformers(input, id, step)
      input = new MagicString(input.toString())
    }

    return input.toString()
  }

  return { getTransformedHTML }
}

export function logicUno(inputHTML: Ref<string>) {
  const init = ref(false)

  const uno = createGenerator({}, defaultConfig.value as any)
  const output = shallowRef<GenerateResult>()

  let customConfig: UserConfig = {}
  let autocomplete = createAutocomplete(uno as any)
  let initial = true

  const { getTransformedHTML } = useTransformer(uno)
  const transformedHTML = computedAsync(async () => await getTransformedHTML(inputHTML.value))

  async function generate() {
    output.value = await uno.generate(transformedHTML.value || '')
    init.value = true
  }
  function reGenerate() {
    uno.setConfig(customConfig, defaultConfig.value as any)
    generate()
    autocomplete = createAutocomplete(uno as any)
  }

  async function getHint(context: CompletionContext): Promise<CompletionResult | null> {
    const cursor = context.pos
    const result = await autocomplete.suggestInFile(context.state.doc.toString(), cursor)

    if (!result.suggestions?.length)
      return null

    const resolved = result.resolveReplacement(result.suggestions[0][0])
    return {
      from: resolved.start,
      options: result.suggestions.map(([value, label]) => {
        return ({
          label,
          apply: value,
          type: 'text',
          boost: 99,
        })
      }),
    }
  }

  debouncedWatch(
    [customConfigRaw],
    async () => {
      try {
        const result = await evaluateUserConfig(customConfigRaw.value)
        if (result) {
          const preflights = (result.preflights ?? []).filter(p => p.layer !== customCSSLayerName)

          result.preflights = preflights
          customConfig = result
          reGenerate()
          if (initial) {
            const { transformers = [] } = uno.config
            if (transformers.length)
              transformedHTML.value = await getTransformedHTML(inputHTML.value)
            initial = false
          }
        }
      }
      catch (e) {
        console.error(e)
      }
    },
    { debounce: 300, immediate: true },
  )
  return {
    init,
    uno,
    output,
    generate,
    reGenerate,
    getHint,
  }
}

export function useResolverUnocss() {
  const uno = createGenerator({}, defaultConfig.value as any)
  const { getTransformedHTML } = useTransformer(uno)

  async function resolverUno(content: string, options?: GenerateOptions) {
    const transformedHTML = await getTransformedHTML(content, options?.id)
    const output = options?.id?.endsWith('.css') ? undefined : await uno.generate(transformedHTML || '', options)
    return {
      css: options?.id?.endsWith('.css') ? transformedHTML : output?.css,
      output,
    }
  }

  async function updateUnoConfig(customConfig: UserConfig = {}, content: string) {
    uno.setConfig(customConfig, defaultConfig.value as any)
    return await resolverUno(content)
  }

  return {
    resolverUno,
    updateUnoConfig,
  }
}
