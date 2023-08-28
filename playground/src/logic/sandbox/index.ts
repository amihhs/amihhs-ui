// @unocss-include
import { v4 as uuidv4 } from 'uuid'
import { sandboxFiles } from './file'
import { generateSandboxDoc } from './content'
import type { ComponentDemo } from './types'

export * from './file'
export * from './content'
export * from './types'

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

export function createSandbox(language: Ref<ComponentDemo['type']> = ref('html')) {
  const sandboxContainerRef = ref<HTMLElement | null>(null)
  const sandboxRef = ref<HTMLIFrameElement | null>(null)
  const uuid = ref<string>(uuidv4())
  const { files, addFile, addFiles, removeFile, getFile } = sandboxFiles()

  function updateSandboxDoc(srcdoc: string) {
    if (!sandboxRef.value)
      return
    sandboxRef.value.setAttribute('data-uuid', uuid.value)
    sandboxRef.value.setAttribute('srcdoc', srcdoc)
  }

  const watchStop = throttledWatch([files], async () => {
    const srcdoc = await generateSandboxDoc(uuid.value, files)
    updateSandboxDoc(srcdoc)
  }, { immediate: true, deep: true })

  onMounted(() => {
    if (language.value === 'html')
      sandboxRef.value = create(sandboxContainerRef.value)
  })
  onUnmounted(() => {
    watchStop()
  })

  return {
    sandboxContainerRef,
    uuid,

    files,
    addFile,
    addFiles,
    removeFile,
    getFile,
  }
}
