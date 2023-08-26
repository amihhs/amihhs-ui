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

export function filesClassify(files: Map<string, string>) {
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
