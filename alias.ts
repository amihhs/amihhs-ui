import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '@amihhs/quickly-dev-cli': r('./packages/cli/src/'),
  '@amihhs/quickly-dev-exe': r('./packages/exe/src/'),
}
