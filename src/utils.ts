export function isObject (value: any): boolean {
  return !!value && typeof value === 'object' && value.constructor === Object
}

export function empty (value: any): boolean {
  return (isObject(value) && Object.keys(value).length === 0) || value === null
}

export function cloneObject (obj: any): any {
  return Object.assign({}, obj)
}

export function reorder<T> (list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  if (removed) {
    result.splice(endIndex, 0, removed)
  }

  return result
}

export function noop (): void {}
