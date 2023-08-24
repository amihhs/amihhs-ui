import type { Alias } from 'vite'

export interface DemoFile {
  name: string
  content: string
  language: string
}

export interface DemoDir {
  name: string
  children: (DemoDir | DemoFile)[]
}

export type DemoItem = DemoFile | DemoDir

export interface DemoContext extends Required<DemoLoaderPluginOptions> {
  paths: Record<string, string>
  root: string
  alias: Alias[]
}

export interface DemoLoaderPluginOptions {
  paths?: Record<string, string> | string
  /**
   * @default [/^\./]
   */
  exclude?: (string | RegExp)[]
  /**
   * @default ['.html', '.css', '.js', '.ts']
   */
  extensions?: string[]
  /**
   * @default /
   * @example virtual:demo-loader/button  + childrenResolvePath: 'src' => .../button/src/
   * @example virtual:demo-loader/button  + childrenResolvePath: 'demo' => .../button/demo/
   */
  childrenResolveBase?: string | ((id: string) => string)
}
