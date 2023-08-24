import path from 'node:path/posix'
import type { DemoContext } from './types'
import { RESOLVE_VIRTUAL_MODULE_ID } from './const'
import { isFunction } from './shared'

export function toPosix(path: string): string {
  return path.replace(/\\/g, '/')
}

export function resolvePath(filePath: string, context: Pick<DemoContext, 'alias' | 'root'>): string {
  const { alias, root } = context

  let newFilePath = filePath
  if (filePath.startsWith('./') || filePath.startsWith('../') || filePath.startsWith('/')) {
    newFilePath = path.join(root, filePath)
  }
  else {
    const aliasItem = alias.find(i => filePath.startsWith(i.find as string))
    if (aliasItem)
      newFilePath = filePath.replace(aliasItem.find, aliasItem.replacement)
    else
      throw new Error(`[vite-plugin-demo] can not resolve path: ${filePath}`)
  }

  return newFilePath
}

export function resolveChildPath(id: string, context: Pick<DemoContext, 'paths' | 'childrenResolveBase'>): string {
  const { paths } = context
  const childPath = id.replace(RESOLVE_VIRTUAL_MODULE_ID, '').replace(/^\//, '')

  let childrenResolveBase = (isFunction(context.childrenResolveBase) ? context.childrenResolveBase(id) : context.childrenResolveBase) || ''

  if (childrenResolveBase.startsWith('/'))
    childrenResolveBase = childrenResolveBase.slice(1)

  if (Object.keys(paths).length === 1 && paths.__default)
    return path.join(paths.__default, childPath, childrenResolveBase)

  for (const key in paths) {
    if (childPath.startsWith(key))
      return path.join(paths[key], childPath.replace(key, ''), childrenResolveBase)
  }

  throw new Error(`[vite-plugin-demo] can not resolve child path: ${childPath}, id: ${id}`)
}
