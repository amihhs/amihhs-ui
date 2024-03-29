import hljs from 'highlight.js'

export function getFileType(filename: string) {
  const ext = filename.split('.').pop()
  if (ext === 'html')
    return 'html'
  if (ext === 'css')
    return 'css'
  if (ext === 'js')
    return 'javascript'
  if (ext === 'ts')
    return 'typescript'
  if (ext === 'vue')
    return 'javascript'
  return 'html'
}

export function createCodeHtml(language: string, code: string, trim: boolean): string | null {
  if (!hljs)
    return null

  if (!(language && hljs.getLanguage(language)))
    return null

  return hljs.highlight(trim ? code.trim() : code, {
    language,
  }).value
}

export function transformComponentPath(path: string, ...args: string[]) {
  path = path + (path.endsWith('/') ? '' : '/') + args.join('/')

  if (path.startsWith('@components/'))
    return path.replace('@components/', '../../../../../packages/')

  return path
}
