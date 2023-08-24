import process from 'node:process'
import type { Plugin } from 'vite'
import { PLUGIN_NAME, RESOLVE_VIRTUAL_MODULE_ID, VIRTUAL_MODULE_ID } from './const'
import { getVirtualModuleContent } from './content'
import type { DemoContext, DemoLoaderPluginOptions } from './types'
import { resolvePath, toPosix } from './fs'
import { isString } from './shared'

export * from './types'

export function DemoLoaderPlugin(options: DemoLoaderPluginOptions = {}): Plugin {
  const {
    paths = {},
    exclude = [/^\./],
    extensions = ['.html', '.css', '.js', '.ts'],
    childrenResolveBase = '/',
  } = options

  const context: DemoContext = {
    root: process.cwd(),
    alias: [],
    paths: isString(paths) ? { __default: paths } : paths,
    exclude,
    extensions,
    childrenResolveBase,
  }
  const plugin: Plugin = {
    name: PLUGIN_NAME,
    configResolved(e) {
      context.root = toPosix(e.root)
      context.alias = e.resolve.alias.filter(i => typeof i.find === 'string').map(i => ({
        ...i,
        replacement: toPosix(i.replacement),
      }))

      const paths: Record<string, string> = isString(options.paths) ? { __default: options.paths } : (options.paths || {})
      for (const key in paths)
        paths[key] = resolvePath(toPosix(paths[key]), { alias: context.alias, root: context.root })

      context.paths = paths

      // console.log('configResolved', JSON.stringify(context))
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID || id.startsWith(VIRTUAL_MODULE_ID))
        return RESOLVE_VIRTUAL_MODULE_ID + id.replace(VIRTUAL_MODULE_ID, '')
    },
    load(id) {
      if (id === RESOLVE_VIRTUAL_MODULE_ID || id.startsWith(RESOLVE_VIRTUAL_MODULE_ID))
        return getVirtualModuleContent(id, context)
    },
    async handleHotUpdate(ctx) {

    },
  }

  return plugin
}
