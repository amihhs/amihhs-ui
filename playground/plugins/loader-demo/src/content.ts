import fs from 'node:fs'
import { RESOLVE_VIRTUAL_MODULE_ID } from './const'
import type { DemoContext, DemoItem } from './types'
import { isString } from './shared'
import { resolveChildPath } from './fs'

const defaultExport = 'export default {}'
export function getVirtualModuleContent(id: string, context: DemoContext): string {
  const { paths } = context
  if (!isString(paths) && Object.keys(paths).length === 0)
    return defaultExport

  const isChildren = id.startsWith(RESOLVE_VIRTUAL_MODULE_ID) && id !== RESOLVE_VIRTUAL_MODULE_ID
  // console.log('getVirtualModuleContent', id, isChildren)
  if (isChildren)
    return getChildrenModuleContent(id, context)
  else
    return getRootModuleContent(id, context)
}

export function getChildrenModuleContent(id: string, context: DemoContext): string {
  const name = id.replace(RESOLVE_VIRTUAL_MODULE_ID, '').replace(/^\//, '').split('/').shift()
  const childPath = resolveChildPath(id, context)

  const children: DemoItem[] = getDirsDemos(childPath, context)

  const content = {
    name,
    children,
  }
  return `export default ${JSON.stringify(content)}`
}

export function getRootModuleContent(id: string, context: DemoContext): string {
  const { paths } = context
  const contents: Record<string, DemoItem[]> = {}

  for (const key in paths) {
    const childPath = paths[key]
    const children: DemoItem[] = getDirsDemos(childPath, context)
    contents[key] = children
  }

  return `export default ${JSON.stringify(contents)}`
}

export function getDirsDemos(dirPath: string, context: DemoContext): DemoItem[] {
  if (!fs.existsSync(dirPath))
    throw new Error(`[vite-plugin-demo] can not find directory: ${dirPath}`)

  if (!fs.statSync(dirPath).isDirectory())
    throw new Error(`[vite-plugin-demo]  isn't directory: ${dirPath}`)

  const files = fs.readdirSync(dirPath)
  const children: DemoItem[] = []
  for (const item of files) {
    const itemPath = `${dirPath}/${item}`
    const stat = fs.statSync(itemPath)
    if (stat.isDirectory()) {
      children.push({
        name: item,
        children: getDirsDemos(itemPath, context),
      })
    }
    else if (stat.isFile()) {
      const ext = item.split('.').pop()
      if (context.extensions.includes(`.${ext}`)) {
        const content = fs.readFileSync(itemPath, 'utf-8')
        children.push({
          name: item,
          content,
          language: ext || '',
        })
      }
    }
  }

  return children
}
