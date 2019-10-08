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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var getNestedObject = function (obj, path) {
    return path.reduce(function (_obj, key) { return (_obj && _obj[key] !== 'undefined' ? _obj[key] : undefined); }, obj);
};
var getObjectPath = function (obj, path) {
    return path.reduce(function (accumulator, pathElement) {
        var _obj = getNestedObject(obj, accumulator);
        if (_obj === undefined) {
            throw Error("[immute] invalid path, \"[" + accumulator.join(', ') + "]\" does not exists");
        }
        switch (typeof pathElement) {
            case 'string':
            case 'number':
                // @ts-ignore
                if (!_obj[pathElement] === undefined) {
                    throw Error("[immute] invalid path, \"[" + __spreadArrays(accumulator, [pathElement]).join(', ') + "]\" does not exists");
                }
                return __spreadArrays(accumulator, [pathElement]);
            case 'function':
                if (!Array.isArray(_obj)) {
                    throw Error("[immute] not iterable, element at location \"[" + accumulator.join(', ') + "]\" is not array");
                }
                // @ts-ignore
                var index = _obj.findIndex(pathElement);
                if (index === -1) {
                    throw Error("[immute] invalid index, can not find element in collection \"[" + accumulator.join(', ') + "]\"");
                }
                return __spreadArrays(accumulator, [index]);
            default:
                throw Error("[immute] invalid path, \"" + typeof pathElement + "\" is neither \"string\" nor \"function\"");
        }
    }, []);
};
var getImmutedObject = function (store, path, value) {
    var _a;
    if (path.length === 0) {
        return value;
    }
    var _path = getObjectPath(store, path);
    // @ts-ignore
    var parent = getNestedObject(store, _path.slice(0, -1));
    var object = getNestedObject(store, _path);
    var selector = _path[_path.length - 1];
    var _ref = typeof selector === 'number' ? [] : {};
    var _value = typeof value === 'function' ? value(object) : value;
    // @ts-ignore
    var _parent = Object.assign(_ref, parent, (_a = {}, _a[selector] = _value, _a));
    if (_value === undefined) {
        if (typeof selector === 'number') {
            // @ts-ignore
            _parent = _parent.filter(function (el) { return el !== undefined; });
        }
        else {
            var _b = selector, nil = _parent[_b], __parent = __rest(_parent, [typeof _b === "symbol" ? _b : _b + ""]);
            _parent = __parent;
        }
    }
    Object.freeze(_parent);
    return getImmutedObject(store, path.slice(0, -1), _parent);
};
exports.immute = function (store, path, value) {
    if (path.length === 0) {
        throw Error("[immute] invalid path, empty");
    }
    return getImmutedObject(store, path, value);
};
