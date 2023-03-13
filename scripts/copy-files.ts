import { copyFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// relative to scripts directory
const destinations = [
  ['../LICENSE', '../packages/test/LICENSE'],
  ['../README.md', '../packages/test/README.md'],
  ['../LICENSE', '../packages/utils/LICENSE'],
  ['../README.md', '../packages/utils/README.md'],
]

const _filename = fileURLToPath(import.meta.url)
destinations.forEach(([src, dest]) => {
  copyFileSync(resolve(_filename, '..', src), resolve(_filename, '..', dest))
})
