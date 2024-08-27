"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
exports.empty = empty;
exports.cloneObject = cloneObject;
exports.reorder = reorder;
exports.noop = noop;
function isObject(value) {
    return !!value && typeof value === 'object' && value.constructor === Object;
}
function empty(value) {
    return (isObject(value) && Object.keys(value).length === 0) || value === null;
}
function cloneObject(obj) {
    return Object.assign({}, obj);
}
function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
        result.splice(endIndex, 0, removed);
    }
    return result;
}
function noop() { }
