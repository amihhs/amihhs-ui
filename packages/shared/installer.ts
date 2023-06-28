/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * Create a component installer
 * source: [element-plus](https://github.com/element-plus/element-plus)
 */

import type { App, Directive, Plugin } from '@vue/runtime-core'
import { NOOP } from '@vue/shared'
import { INSTALLED_KEY, PREFIX_KEY } from './constants/key'
import type { SFCInstallWithContext, SFCWithInstall } from './types/vue'
import { replaceComponentPrefix } from './componentName'

export function makeInstaller(components: Plugin[] = []) {
  const install = (app: App) => {
    // @ts-expect-error
    if (app[INSTALLED_KEY])
      return

    // @ts-expect-error
    app[INSTALLED_KEY] = true
    components.forEach(c => app.use(c))
  }

  return {
    install,
  }
}

export function withInstall<T, E extends Record<string, any>>(main: T,
  extra?: E) {
  (main as SFCWithInstall<T>).install = (app): void => {
    // change the prefix of component name
    const prefix = (app.config.globalProperties as any)[PREFIX_KEY] || ''

    for (const comp of [main, ...Object.values(extra ?? {})])
      app.component(replaceComponentPrefix(comp.name, prefix), comp)
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra))
      (main as any)[key] = comp
  }
  return main as SFCWithInstall<T> & E
}

export function withInstallFunction<T>(fn: T, name: string) {
  (fn as SFCWithInstall<T>).install = (app: App) => {
    (fn as SFCInstallWithContext<T>)._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn as SFCInstallWithContext<T>
}

export function withInstallDirective<T extends Directive>(directive: T,
  name: string) {
  (directive as SFCWithInstall<T>).install = (app: App): void => {
    app.directive(name, directive)
  }

  return directive as SFCWithInstall<T>
}

export function withNoopInstall<T>(component: T) {
  (component as SFCWithInstall<T>).install = NOOP

  return component as SFCWithInstall<T>
}
