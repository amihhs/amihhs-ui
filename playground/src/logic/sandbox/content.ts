// @unocss-include
import type { FilesLoaderFile } from 'vite-plugin-files-loader'
import resetCSS from '@unocss/reset/tailwind.css?raw'
import { useResolverUnocss } from '../unocss'
import { filesClassify } from './file'

export async function generateSandboxContent(demos: Record<string, FilesLoaderFile[]>) {
  const sandboxes: { name: string; sandbox: Record<string, string> }[] = []
  for (const name in demos) {
    const files = (demos[name]?.filter(v => v.content) || [])
      .sort((a, b) => b.language.localeCompare(a.language))

    const sandbox: Record<string, string> = {}
    for (const file of files)
      sandbox[file.name] = file.content

    sandboxes.push({
      name,
      sandbox,
    })
  }
  return sandboxes
}

export function multiFileHeader(fileName: string, content: string = '') {
  return `<div class="p-sm"><!-- ${fileName} -->\n
  <h3 class="mb-sm font-bold font-mono text-center text-5">${fileName.split('.')[0]}</h3>\n
  ${content}</div>`
}

export async function generateStyleCode(styles: Map<string, string>, html: Map<string, string> = new Map()) {
  const { resolverUno } = useResolverUnocss()
  const styleCodes: string[] = []
  if (html.size > 0) {
    for (const [name, content] of html) {
      const { css } = await resolverUno(content, { preflights: !styleCodes.length, id: name })
      if (!css)
        continue
      styleCodes.push(`<style type="text/css" file="${name}">${css}</style>`)
    }

    if (html.size > 1) {
      const { css } = await resolverUno(multiFileHeader(''), { preflights: !styleCodes.length, id: 'all' })
      styleCodes.unshift(`<style type="text/css">${css}</style>`)
    }
  }

  for (const [name, content] of styles) {
    const { css } = await resolverUno(content, { preflights: !styleCodes.length, id: name })
    if (!css)
      continue
    styleCodes.push(`<style type="text/css" file="${name}">${css}</style>`)
  }

  styleCodes.unshift(`<style type="text/css">${resetCSS}</style>`)
  return styleCodes
}

export async function generateScriptCode(scripts: Map<string, string>) {
  const scriptCodes: string[] = []
  for (const [name, content] of scripts)
    scriptCodes.push(`<script tag="${name}">${content}</script>`)

  return scriptCodes
}

export function readSandBoxHeightScript() {
  return `<script>
  function listenMessage() {
    const uuid = document.body.dataset.uuid
    window.parent.postMessage({ type: 'sandbox-height', uuid, height: document.body.scrollHeight }, '*')
  }
  const resizeObserver = new ResizeObserver((entries) =>{
    listenMessage()
  })
  window.addEventListener('load', () => {
    resizeObserver.observe(document.body)
    listenMessage()
  })
</script>`
}

export async function generateHtmlCode(html: Map<string, string>) {
  const htmlCodes: string[] = []
  for (const [name, content] of html) {
    if (html.size > 1)
      htmlCodes.push(multiFileHeader(name, content))
    else
      htmlCodes.push(`<!-- ${name} -->\n${content}`)
  }

  return htmlCodes
}

export async function generateSandboxDoc(uuid: string, files: Map<string, string>): Promise<string> {
  const { style, script, html } = filesClassify(files)

  const styleCodes: string[] = []
  const scriptCodes: string[] = []
  const htmlCode: string[] = []

  await Promise.all([
    generateStyleCode(style, html),
    generateScriptCode(script),
    generateHtmlCode(html),
  ]).then(([styles, scripts, html]) => {
    styleCodes.push(...styles)
    scriptCodes.push(...scripts)
    htmlCode.push(...html)
  })
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${styleCodes.join('\n')}
  ${readSandBoxHeightScript()}\n
</head>
<body data-uuid="${uuid}">
  ${htmlCode.join('\n')}
  ${scriptCodes.join('\n')}
</body>
</html>
  `
}
