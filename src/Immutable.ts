/**
 * Remove o item no índice index
 */
export function arrayDelete<T> (arr: ReadonlyArray<T>, index: number): Array<T> {
  return arr.filter((_value, key) => key !== index)
}

/**
 * Copia uma array substituindo o valor em `index` por `replacement`
 */
export function replaceAt<T> (arr: ReadonlyArray<T>, index: number, replacement: T): Array<T>
export function replaceAt<T> (arr: ReadonlyArray<T>, index: number, replacement: findReplaceReplacer<T>): Array<T>
export function replaceAt<T> (arr: ReadonlyArray<T>, index: number, replacement: any): Array<T> {
  if (typeof replacement === 'function') {
    return arr.map((value, key) => key === index ? replacement(value) : value)
  }
  return arr.map((value, key) => key === index ? replacement : value)
}


export type findReplaceFinder<T> = (value: T, key: number) => boolean
export type findReplaceReplacer<T> = (value: T) => T

export function findReplace<T> (arr: ReadonlyArray<T>, find: T, replace: T): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: T, replace: findReplaceReplacer<T>): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: findReplaceFinder<T>, replace: T): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: findReplaceFinder<T>, replace: findReplaceReplacer<T>): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: any, replace: any): Array<T> {
  if (typeof find !== 'function') {
    find = (value: T) => value === find
  }
  if (typeof replace !== 'function') {
    replace = () => replace
  }
  return arr.map((value, key) => find(value, key) ? replace(value) : value)
}
