import type { GenerateResult, UnoGenerator, UnocssPluginContext, UserConfig } from 'unocss'
import { createGenerator } from 'unocss'
import { createAutocomplete } from '@unocss/autocomplete'
import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import MagicString from 'magic-string'
import type { Ref } from 'vue'
import { customCSSLayerName, customConfigRaw, defaultConfig } from './config'
import { evaluateUserConfig } from './shared'

export function logicUno(inputHTML: Ref<string>) {
  const init = ref(false)

  const uno = createGenerator({}, defaultConfig.value as any)
  const output = shallowRef<GenerateResult>()

  let customConfig: UserConfig = {}
  let autocomplete = createAutocomplete(uno as any)
  let initial = true

  const { transformedHTML, getTransformedHTML } = useTransformer(uno, inputHTML)

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
              transformedHTML.value = await getTransformedHTML()
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

function useTransformer(uno: UnoGenerator<{}>, inputHTML: Ref<string>) {
  const transformedHTML = computedAsync(async () => await getTransformedHTML())

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

  async function getTransformedHTML() {
    const id = 'input.html'
    const input = new MagicString(inputHTML.value)
    await applyTransformers(input, id, 'pre')
    await applyTransformers(input, id)
    await applyTransformers(input, id, 'post')
    return input.toString()
  }

  return { transformedHTML, getTransformedHTML }
}
