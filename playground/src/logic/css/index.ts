import type { GenerateStyleCodeOptions } from '../../types'

export function generateTemplateStyleCode(options?: GenerateStyleCodeOptions) {
  const {
    lang = 'css',
    scoped = true,
    applyVariableKey = '--uno',
    presets = [],
  } = options || {}
  if (presets.length === 0)
    return ''

  const presetsCode = presets.map(([selector, style]) => {
    return `${selector} {
  ${style.includes(';') ? style : `${applyVariableKey}: ${style};`}
}`
  }).join('\n')

  return `
<style ${styleTagConfig(lang, scoped)}>
${presetsCode}
</style>
`
}

export function styleTagConfig(lang: GenerateStyleCodeOptions['lang'], scoped: GenerateStyleCodeOptions['scoped']) {
  return `${scoped ? 'scoped' : ''}${lang !== 'css' ? ` lang='${lang}'` : ''}`
}
