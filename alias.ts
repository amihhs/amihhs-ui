import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '@amihhs/ui': r('./packages/ui/src/'),
  '@amihhs/shared': r('./packages/shared/src/'),
}
