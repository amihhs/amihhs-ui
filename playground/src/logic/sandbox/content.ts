// @unocss-include
import type { FilesLoaderFile } from 'vite-plugin-files-loader'
import resetCSS from '@unocss/reset/tailwind.css?raw'
import YAML from 'yaml'
import { useResolverUnocss } from '../unocss'
import { filesClassify } from './file'
import type { ComponentDemo, ComponentYaml } from './types'
import { generateAppTemplate } from '~/logic/vue'

export function removeSortNumber(name: string) {
  return name.replace(/\d+\.(\s+)?/, '')
}
export function sortNumber(name: string) {
  const match = name.match(/\d+\.(\s+)?/)
  return match ? Number.parseInt(match[0]) : 99999
}
export function basePrefixSort(a: FilesLoaderFile, b: FilesLoaderFile) {
  const aPrefix = sortNumber(a.name)
  const bPrefix = sortNumber(b.name)
  if (a.language === b.language && aPrefix !== bPrefix)
    return aPrefix - bPrefix
  else if (a.language === b.language)
    return a.name.localeCompare(b.name)
  else
    return b.language.localeCompare(a.language)
}

export function getPlaygroundType(name: string) {
  if (name.toLocaleLowerCase() === 'vue')
    return 'vue'
  else if (name.toLocaleLowerCase() === 'react')
    return 'react'
  else
    return 'html'
}

export async function generateSandboxContent(demos: Record<string, FilesLoaderFile[]>) {
  const sandboxes: ComponentDemo[] = []
  for (const name in demos) {
    const files = (demos[name] || []).sort((a, b) => basePrefixSort(a, b))

    const y = (files.filter(v => v.name === 'README.yaml')[0] as FilesLoaderFile)?.content
    const yaml: ComponentYaml = y ? YAML.parse(y) : { Title: '', Description: '', Required: {} }

    const type = getPlaygroundType(name)
    let sandbox: Record<string, string> = {}

    switch (type) {
      case 'vue':
        sandbox = await generateVueSandbox(files.filter(v => v.name !== 'README.yaml'))
        break
      case 'react':
        for (const file of files.filter(v => v.name !== 'README.yaml'))
          sandbox[file.name] = file.content
        break
      default:
        for (const file of files.filter(v => v.name !== 'README.yaml'))
          sandbox[file.name] = file.content
        break
    }
    sandboxes.push({
      type: getPlaygroundType(name),
      name,
      sandbox,
      yaml,
    })
  }
  return sandboxes
}

export async function generateVueSandbox(files: FilesLoaderFile[]) {
  const { resolverUno } = useResolverUnocss()
  const sandbox: Record<string, string> = {
    'App.vue': generateAppTemplate(),
  }
  let needResolveStyleContent = ''
  for (const file of files.filter(v => v.name !== 'README.yaml')) {
    sandbox[file.name] = file.content
    needResolveStyleContent += `${file.content}\n\n`
  }
  const { css } = await resolverUno(needResolveStyleContent)
  sandbox['reset.css'] = resetCSS
  sandbox['style.css'] = css || ''
  return sandbox
}

export function multiFileHeader(fileName: string, content: string = '') {
  return `<div class="p-sm"><!-- ${fileName} -->\n
  <h3 class="mb-sm font-bold font-mono text-center text-5">${removeSortNumber(fileName).split('.')[0]}</h3>\n
  ${content}</div>`
}

export async function generateStyleCode(styles: Map<string, string>, html: Map<string, string> = new Map()) {
  const { resolverUno } = useResolverUnocss()
  const styleCodes: string[] = []

  let resolveContent = ''
  const name = []
  if (html.size > 0) {
    for (const [_, content] of html) {
      resolveContent += `\n\n${content}`
      name.push(_)
    }

    if (html.size > 1)
      resolveContent += `\n\n${multiFileHeader('')}`
  }

  for (const [_, content] of styles) {
    resolveContent += `\n\n${content}`
    name.push(_)
  }

  const { css } = await resolverUno(resolveContent, { preflights: !styleCodes.length })
  styleCodes.push(`<style type="text/css" file="${JSON.stringify(name)}">${css}</style>`)

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
