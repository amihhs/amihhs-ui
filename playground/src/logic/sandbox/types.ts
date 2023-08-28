export interface ComponentDemo {
  name: string
  type: 'html' | 'vue' | 'react'
  sandbox: Record<string, string>
  yaml: ComponentYaml
}
export interface ComponentYaml {
  Title: string
  Description: string
  Required: Record<string, Record<string, string>[]>
}
