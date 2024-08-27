/**
 * Remove o item no índice index
 */
export declare function arrayDelete<T>(arr: ReadonlyArray<T>, index: number): Array<T>;
/**
 * Copia uma array substituindo o valor em `index` por `replacement`
 */
export declare function replaceAt<T>(arr: ReadonlyArray<T>, index: number, replacement: T): Array<T>;
export declare function replaceAt<T>(arr: ReadonlyArray<T>, index: number, replacement: findReplaceReplacer<T>): Array<T>;
export type findReplaceFinder<T> = (value: T, key: number) => boolean;
export type findReplaceReplacer<T> = (value: T) => T;
export declare function findReplace<T>(arr: ReadonlyArray<T>, find: T, replace: T): Array<T>;
export declare function findReplace<T>(arr: ReadonlyArray<T>, find: T, replace: findReplaceReplacer<T>): Array<T>;
export declare function findReplace<T>(arr: ReadonlyArray<T>, find: findReplaceFinder<T>, replace: T): Array<T>;
export declare function findReplace<T>(arr: ReadonlyArray<T>, find: findReplaceFinder<T>, replace: findReplaceReplacer<T>): Array<T>;
