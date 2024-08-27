export function isObject(value) {
    return !!value && typeof value === 'object' && value.constructor === Object;
}
export function empty(value) {
    return (isObject(value) && Object.keys(value).length === 0) || value === null;
}
export function cloneObject(obj) {
    return Object.assign({}, obj);
}
export function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
        result.splice(endIndex, 0, removed);
    }
    return result;
}
export function noop() { }
