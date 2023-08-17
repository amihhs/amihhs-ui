import { resolve } from 'node:path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '@components': r('./packages/components/'),
  '@amihhs/shared': r('./packages/shared/src/'),
  '@amihhs/utils': r('./packages/utils/src/'),
}
