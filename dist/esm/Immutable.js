/**
 * Remove o item no índice index
 */
export function arrayDelete(arr, index) {
    return arr.filter((_value, key) => key !== index);
}
export function replaceAt(arr, index, replacement) {
    if (typeof replacement === 'function') {
        return arr.map((value, key) => key === index ? replacement(value) : value);
    }
    return arr.map((value, key) => key === index ? replacement : value);
}
export function findReplace(arr, find, replace) {
    if (typeof find !== 'function') {
        find = (value) => value === find;
    }
    if (typeof replace !== 'function') {
        replace = () => replace;
    }
    return arr.map((value, key) => find(value, key) ? replace(value) : value);
}
