"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.immute = exports.select = exports.DELETE = void 0;
exports.DELETE = Symbol('delete');
const getNestedObject = (obj, path) => {
    return path.reduce((_obj, key) => (_obj && _obj[key] !== undefined ? _obj[key] : undefined), obj);
};
var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum["INVALID_PATH"] = "invalid path";
    ErrorEnum["INVALID_TYPE"] = "invalid path, path elements should be typeof \"number\", \"string\" or \"function\"";
    ErrorEnum["NOT_ITERABLE"] = "not iterable, array expected at path";
    ErrorEnum["UNDEFINED_VALUE"] = "unexpected undefined value";
})(ErrorEnum || (ErrorEnum = {}));
const throwError = (msg, path = []) => {
    throw new Error(`[ngrx-immutable] ${msg}, [${path.join(', ')}]`);
};
const getObjectPath = (obj, path) => {
    // @ts-ignore
    return path.reduce((accumulator, pathElement) => {
        const nestedObject = getNestedObject(obj, accumulator);
        if (nestedObject === undefined) {
            throwError(ErrorEnum.INVALID_PATH, accumulator);
        }
        switch (typeof pathElement) {
            case 'number':
                if (!Array.isArray(nestedObject)) {
                    throwError(ErrorEnum.NOT_ITERABLE, accumulator);
                }
            // eslint-disable-next-line no-fallthrough
            case 'string':
                if (!nestedObject[pathElement] === undefined) {
                    throwError(ErrorEnum.INVALID_PATH, [...accumulator, pathElement]);
                }
                return [...accumulator, pathElement];
            case 'function': {
                if (!Array.isArray(nestedObject)) {
                    throwError(ErrorEnum.NOT_ITERABLE, accumulator);
                }
                const index = nestedObject.findIndex(pathElement);
                if (index === -1) {
                    throwError(ErrorEnum.INVALID_PATH, [...accumulator, index]);
                }
                return [...accumulator, index];
            }
            default:
                throwError(ErrorEnum.INVALID_TYPE, [...accumulator, `<${typeof pathElement}>`]);
        }
    }, []);
};
const getImmutableObject = (store, path, value, _DELETE) => {
    if (path.length === 0) {
        return value;
    }
    const parent = getNestedObject(store, path.slice(0, -1));
    const leafKey = path[path.length - 1];
    const subject = parent[leafKey];
    const valueToUse = typeof value === 'function' ? value(subject) : value;
    const baseStructure = typeof leafKey === 'number' ? [] : {};
    let nextParent = Object.assign(baseStructure, parent, { [leafKey]: valueToUse });
    if (valueToUse === _DELETE) {
        if (typeof leafKey === 'number') {
            nextParent = nextParent.filter((el) => el !== _DELETE);
        }
        else {
            const _a = nextParent, _b = leafKey, nil = _a[_b], _nextParent = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            nextParent = _nextParent;
        }
    }
    Object.freeze(nextParent);
    return getImmutableObject(store, path.slice(0, -1), nextParent);
};
const immutable = (store, path, value, _DELETE) => {
    if (value === undefined && _DELETE !== undefined) {
        throwError(ErrorEnum.UNDEFINED_VALUE);
    }
    if (path.length === 0) {
        throwError(ErrorEnum.INVALID_PATH);
    }
    const calculatedPath = getObjectPath(store, path);
    return getImmutableObject(store, calculatedPath, value, _DELETE);
};
function select(store, path) {
    if (path.some((pathElement) => typeof pathElement === 'function')) {
        return getNestedObject(store, getObjectPath(store, path));
    }
    return getNestedObject(store, path);
}
exports.select = select;
exports.immute = (store, path, value) => immutable(store, path, value, undefined);
exports.default = (store, path, value) => immutable(store, path, value, exports.DELETE);
