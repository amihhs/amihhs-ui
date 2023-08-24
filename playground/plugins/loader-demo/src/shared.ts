export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isFunction(value: unknown): value is (...args: any) => any {
  return typeof value === 'function'
}
