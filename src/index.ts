type findIndexFunction = (element: any, index: number, collection: []) => number;
type oPathElement = string | number;
type iPathElement = oPathElement | findIndexFunction;

const getNestedObject = (obj: object, path: oPathElement[]) => {
    return path.reduce((_obj: any, key: any) => (_obj && _obj[key] !== 'undefined' ? _obj[key] : undefined), obj);
};

enum ErrorEnum {
    INVALID_PATH = 'invalid path',
    INVALID_TYPE = 'invalid path, path elements should be typeof "number", "string" or "function"',
    NOT_ITERABLE = 'not iterable, array expected at path'
}

const throwError = (msg: ErrorEnum, path: oPathElement[] = []) : void => {
  throw new Error(`[ngrx-immutable] ${msg}, [${path.join(', ')}]`);
};

const getObjectPath = (obj: object, path: iPathElement[]): oPathElement[] => {
    return path.reduce((accumulator: oPathElement[], pathElement: iPathElement): oPathElement[] => {
        const _obj = getNestedObject(obj, accumulator as oPathElement[]);

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
                    throwError(ErrorEnum.INVALID_PATH, [...accumulator, pathElement]);
                }

                return [...accumulator, pathElement];

            case 'function':
                if (!Array.isArray(_obj)) {
                    throwError(ErrorEnum.NOT_ITERABLE, accumulator);
                }

                const index = _obj.findIndex(pathElement as any);

                if (index === -1) {
                    throwError(ErrorEnum.INVALID_PATH, [...accumulator, index]);
                }

                return [...accumulator, index];

            default:
                throwError(ErrorEnum.INVALID_TYPE, [...accumulator, `<${typeof pathElement}>`]);
        }
    }, []);
};

const getImmutableObject = (store: object | [any], path: oPathElement[], value: any): object | [any] => {
    if (path.length === 0) {
        return value;
    }

    const parent: object | [] = getNestedObject(store, path.slice(0, -1));
    const selector: oPathElement = path[path.length - 1];
    const object: any = parent[selector];
    const _ref = typeof selector === 'number' ? [] : {};
    const _value: any = typeof value === 'function' ? value(object) : value;
    // @ts-ignore
    let _parent: any = Object.assign(_ref, parent, { [selector]: _value });

    if (_value === undefined) {
        if (typeof selector === 'number') {
            _parent = (_parent as []).filter(el => el !== undefined);
        } else {
            const { [selector]: nil, ...__parent } = _parent;
            _parent = __parent;
        }
    }

    Object.freeze(_parent);
    return getImmutableObject(store, path.slice(0, -1), _parent);
};

export const immutable = (store: object | [any], path: iPathElement[], value: any): object | [any] => {
    if (path.length === 0) {
        throwError(ErrorEnum.INVALID_PATH);
    }

    const _path: oPathElement[] = getObjectPath(store, path);
    return getImmutableObject(store, _path, value);
};

export const immute = immutable;
