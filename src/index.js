"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const getNestedObject = (obj, path) => {
    return path.reduce((_obj, key) => (_obj && _obj[key] !== 'undefined') ? _obj[key] : undefined, obj);
};
const getObjectPath = (obj, path) => {
    return path.reduce((accumulator, pathElement) => {
        const _obj = getNestedObject(obj, accumulator);
        if (_obj === undefined) {
            throw `[immute] invalid path, "[${accumulator.join(', ')}]" does not exists`;
        }
        switch (typeof pathElement) {
            case 'string':
                if (!_obj[pathElement] === undefined) {
                    throw `[immute] invalid path, "[${[...accumulator, pathElement].join(', ')}]" does not exists`;
                }
                return [...accumulator, pathElement];
            case 'function':
                if (!Array.isArray(_obj)) {
                    throw `[immute] not iterable, element at location "[${accumulator.join(', ')}]" is not array`;
                }
                const index = _obj.findIndex(pathElement);
                if (index === -1) {
                    throw `[immute] invalid index, can not find element in collection "[${accumulator.join(', ')}]"`;
                }
                return [...accumulator, index];
            default:
                throw `[immute] invalid path, "${typeof pathElement}" is neither "string" nor "function"`;
        }
    }, []);
};
const getImmutedObject = (store, path, value) => {
    if (path.length === 0) {
        return value;
    }
    const _path = getObjectPath(store, path);
    const parent = getNestedObject(store, _path.slice(0, -1));
    const object = getNestedObject(store, _path);
    const selector = _path[_path.length - 1];
    const _ref = (typeof selector === 'number') ? [] : {};
    const _value = (typeof value === 'function') ? value(object) : value;
    let _parent = Object.assign(_ref, parent, { [selector]: _value });
    if (_value === undefined) {
        if (typeof selector === 'number') {
            _parent = _parent.filter(el => el !== undefined);
        }
        else {
            let _a = selector, nil = _parent[_a], __parent = __rest(_parent, [typeof _a === "symbol" ? _a : _a + ""]);
            _parent = __parent;
        }
    }
    Object.freeze(_parent);
    return getImmutedObject(store, path.slice(0, -1), _parent);
};
exports.immute = (store, path, value) => {
    if (path.length === 0) {
        throw `[immute] invalid path, empty`;
    }
    return getImmutedObject(store, path, value);
};
