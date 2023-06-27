import type { GeneratePropsCodeOptions } from '../../types'

export function generateTemplatePropsCode(options: GeneratePropsCodeOptions) {
  const {
    type = 'withDefaults',
    props = {},
  } = options

  switch (type) {
    case 'withDefaults':
      return generateWithDefaultsPropsCode(props)
    case 'defineProps':
      return generateDefinePropsCode(props)
  }
}

function generateWithDefaultsPropsCode(props: GeneratePropsCodeOptions['props']) {
  const propsCode = Object.entries(props).map(([key, [isRequired, type, defaultValue]]) => {
    return [`${key}${!isRequired ? '?' : ''}: ${type}`, `${key}: ${typeof defaultValue === 'string' ? `'${defaultValue}'` : defaultValue}`]
  })
  const defineCode = propsCode.map(([define]) => define).join(',\n  ')
  const defaultCode = propsCode.map(([_, defaultValue]) => defaultValue).join(',\n  ')
  return `
const props = withDefaults(defineProps<{
  ${defineCode}
}>(), {
  ${defaultCode}
})
`
}

function generateDefinePropsCode(props: GeneratePropsCodeOptions['props']) {
  const propsCode = Object.entries(props).map(([key, [isRequired, type]]) => {
    return `${key}: {
      type: ${type},
      required: ${isRequired},
    }`
  }).join(',\n  ')

  return `
const props = defineProps({
  ${propsCode}
})
`
}
