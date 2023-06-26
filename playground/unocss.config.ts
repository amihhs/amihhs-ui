import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      mode: 'mask', // 模式覆盖 i-carbon:list?bg
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives({
      // the defaults
      applyVariable: ['--at-apply', '--uno-apply', '--uno'],
    }),
    transformerVariantGroup(),
  ],
})
