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
var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum["INVALID_PATH"] = "invalid path";
    ErrorEnum["INVALID_TYPE"] = "invalid path, path elements should be typeof \"number\", \"string\" or \"function\"";
    ErrorEnum["NOT_ITERABLE"] = "not iterable, array expected at path";
})(ErrorEnum || (ErrorEnum = {}));
var throwError = function (msg, path) {
    if (path === void 0) { path = []; }
    throw new Error("[ngrx-immutable] " + msg + ", [" + path.join(', ') + "]");
};
var getObjectPath = function (obj, path) {
    return path.reduce(function (accumulator, pathElement) {
        var _obj = getNestedObject(obj, accumulator);
        if (_obj === undefined) {
            throwError(ErrorEnum.INVALID_PATH, accumulator);
        }
        switch (typeof pathElement) {
            case 'number':
                if (!Array.isArray(_obj)) {
                    throwError(ErrorEnum.NOT_ITERABLE, accumulator);
                }
            case 'string':
                if (!_obj[pathElement] === undefined) {
                    throwError(ErrorEnum.INVALID_PATH, __spreadArrays(accumulator, [pathElement]));
                }
                return __spreadArrays(accumulator, [pathElement]);
            case 'function':
                if (!Array.isArray(_obj)) {
                    throwError(ErrorEnum.NOT_ITERABLE, accumulator);
                }
                var index = _obj.findIndex(pathElement);
                if (index === -1) {
                    throwError(ErrorEnum.INVALID_PATH, __spreadArrays(accumulator, [index]));
                }
                return __spreadArrays(accumulator, [index]);
            default:
                throwError(ErrorEnum.INVALID_TYPE, __spreadArrays(accumulator, ["<" + typeof pathElement + ">"]));
        }
    }, []);
};
var getImmutableObject = function (store, path, value) {
    var _a;
    if (path.length === 0) {
        return value;
    }
    var parent = getNestedObject(store, path.slice(0, -1));
    var selector = path[path.length - 1];
    var object = parent[selector];
    var _ref = typeof selector === 'number' ? [] : {};
    var _value = typeof value === 'function' ? value(object) : value;
    // @ts-ignore
    var _parent = Object.assign(_ref, parent, (_a = {}, _a[selector] = _value, _a));
    if (_value === undefined) {
        if (typeof selector === 'number') {
            _parent = _parent.filter(function (el) { return el !== undefined; });
        }
        else {
            var _b = selector, nil = _parent[_b], __parent = __rest(_parent, [typeof _b === "symbol" ? _b : _b + ""]);
            _parent = __parent;
        }
    }
    Object.freeze(_parent);
    return getImmutableObject(store, path.slice(0, -1), _parent);
};
exports.immutable = function (store, path, value) {
    if (path.length === 0) {
        throwError(ErrorEnum.INVALID_PATH);
    }
    var _path = getObjectPath(store, path);
    return getImmutableObject(store, _path, value);
};
exports.immute = exports.immutable;
