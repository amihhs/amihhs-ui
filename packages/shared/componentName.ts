// default prefix for all components
const COMPONENT_PREFIX = 'Hhs'

export function componentName(name: string) {
  return `${COMPONENT_PREFIX}${name}`
}

export function replaceComponentPrefix(name: string, prefix: string) {
  return name.replace(new RegExp(`^${COMPONENT_PREFIX}`), prefix)
}
