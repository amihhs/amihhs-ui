// @unocss-include
import resetCSS from '@unocss/reset/tailwind.css?raw'
import h from '../../../../packages/components/button/src/basic/demo/index.html?raw'
import { useResolverUnocss } from '../unocss'

function create(sandboxContainer: HTMLElement | null = null) {
  if (!sandboxContainer) {
    console.warn('sandbox Container is not set')
    return null
  }

  const sandbox = document.createElement('iframe')
  sandbox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      // 'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ].join(' '),
  )
  sandbox.setAttribute('class', 'border-0 flex-grow min-w-0 w-full h-full min-h-0')
  sandboxContainer.appendChild(sandbox)

  return sandbox
}

function filesClassify(files: Map<string, string>) {
  const style = new Map<string, string>()
  const script = new Map<string, string>()
  const html = new Map<string, string>()
  for (const [name, content] of files) {
    if (name.endsWith('.css'))
      style.set(name, content)
    else if (name.endsWith('.js'))
      script.set(name, content)
    else if (name.endsWith('.html'))
      html.set(name, content)
  }

  return {
    style,
    script,
    html,
  }
}
async function generateStyleCode(styles: Map<string, string>, html: Map<string, string> = new Map()) {
  const { resolverUno } = useResolverUnocss()
  const styleCodes: string[] = []
  if (html.size > 0) {
    for (const [name, content] of html) {
      const { css } = await resolverUno(content, { preflights: !styleCodes.length, id: name })
      if (!css)
        continue
      styleCodes.push(`<style type="text/css" file="${name}">${css}</style>`)
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
async function generateScriptCode(scripts: Map<string, string>) {
  const scriptCodes: string[] = []
  for (const [name, content] of scripts)
    scriptCodes.push(`<script tag="${name}">${content}</script>`)

  return scriptCodes
}
async function generateHtmlCode(html: Map<string, string>) {
  const htmlCodes: string[] = []
  for (const [name, content] of html)
    htmlCodes.push(`<!-- ${name} -->\n${content}`)
  return htmlCodes
}
async function generateSandboxDoc(files: Map<string, string>): Promise<string> {
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
</head>
<body>
  ${htmlCode.join('\n')}
  ${scriptCodes.map(script => `<script>${script}</script>`).join('\n')}
</body>
</html>
  `
}

export function createSandbox() {
  const sandboxContainerRef = ref<HTMLElement | null>(null)
  const sandboxRef = ref<HTMLIFrameElement | null>(null)

  const { files, addFile, addFiles, removeFile, getFile } = sandboxFiles()
  function updateSandboxDoc(srcdoc: string) {
    if (!sandboxRef.value)
      return
    sandboxRef.value.setAttribute('srcdoc', srcdoc)
  }
  onMounted(() => {
    sandboxRef.value = create(sandboxContainerRef.value)
    updateSandboxDoc(h)
  })

  throttledWatch([files], async () => {
    const srcdoc = await generateSandboxDoc(files)
    updateSandboxDoc(srcdoc)
  })
  return {
    sandboxContainerRef,

    files,
    addFile,
    addFiles,
    removeFile,
    getFile,
  }
}

export function sandboxFiles() {
  const files = reactive<Map<string, string>>(new Map())

  function addFile(name: string, content: string) {
    files.set(name, content)
  }
  function addFiles(files: Record<string, string>) {
    for (const [name, content] of Object.entries(files))
      addFile(name, content)
  }
  function removeFile(name: string) {
    files.delete(name)
  }
  function getFile(name: string) {
    return files.get(name)
  }

  return {
    files,
    addFile,
    addFiles,
    removeFile,
    getFile,
  }
}
