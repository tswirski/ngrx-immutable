type findIndexFunction = (element: any, index: number, collection: []) => number;
type oPathElement = string | number;
type iPathElement = oPathElement | findIndexFunction;
type objectLike = { [index: string]: any } | any[number];

export const DELETE = Symbol('delete');

const getNestedObject = (obj: objectLike, path: oPathElement[]): any => {
    return path.reduce(
        (_obj: any, key: string | number) => (_obj && _obj[key] !== undefined ? _obj[key] : undefined),
        obj,
    );
};

enum ErrorEnum {
    INVALID_PATH = 'invalid path',
    INVALID_TYPE = 'invalid path, path elements should be typeof "number", "string" or "function"',
    NOT_ITERABLE = 'not iterable, array expected at path',
    UNDEFINED_VALUE = 'unexpected undefined value',
}

const throwError = (msg: ErrorEnum, path: oPathElement[] = []): void => {
    throw new Error(`[ngrx-immutable] ${msg}, [${path.join(', ')}]`);
};

const getObjectPath = (obj: objectLike, path: iPathElement[]): oPathElement[] => {
    // @ts-ignore
    return path.reduce((accumulator: oPathElement[], pathElement: iPathElement): oPathElement[] => {
        const nestedObject = getNestedObject(obj, accumulator as oPathElement[]);

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

                const index = nestedObject.findIndex(pathElement as any);

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

const getImmutableObject = (
    store: objectLike,
    path: oPathElement[],
    value: any,
    _DELETE?: symbol | undefined,
): object | [any] => {
    if (path.length === 0) {
        return value;
    }

    const parent: objectLike = getNestedObject(store, path.slice(0, -1));
    const leafKey: oPathElement = path[path.length - 1];
    const subject: any = parent[leafKey];
    const valueToUse: any = typeof value === 'function' ? value(subject) : value;
    const baseStructure = typeof leafKey === 'number' ? [] : {};

    let nextParent: any = Object.assign(baseStructure, parent, { [leafKey]: valueToUse });

    if (valueToUse === _DELETE) {
        if (typeof leafKey === 'number') {
            nextParent = (nextParent as []).filter((el) => el !== _DELETE);
        } else {
            const { [leafKey]: nil, ..._nextParent } = nextParent;
            nextParent = _nextParent;
        }
    }

    Object.freeze(nextParent);
    return getImmutableObject(store, path.slice(0, -1), nextParent);
};

const immutable = (
    store: objectLike,
    path: iPathElement[],
    value: any,
    _DELETE: symbol | undefined,
): objectLike => {
    if (value === undefined && _DELETE !== undefined) {
        throwError(ErrorEnum.UNDEFINED_VALUE);
    }

    if (path.length === 0) {
        throwError(ErrorEnum.INVALID_PATH);
    }

    const calculatedPath: oPathElement[] = getObjectPath(store, path) as oPathElement[];
    return getImmutableObject(store, calculatedPath, value, _DELETE);
};

export function select(store: objectLike, path: iPathElement[], defaultValue?: any): any {
    try {
        if (path.some((pathElement: iPathElement) => typeof pathElement === 'function')) {
            return getNestedObject(store, getObjectPath(store, path) as oPathElement[]);
        }

        return getNestedObject(store, path as oPathElement[]);
        } catch (e){}
    return defaultValue;
}

export const immute = (store: objectLike, path: iPathElement[], value: any) =>
    immutable(store, path, value, undefined);

export default (store: objectLike, path: iPathElement[], value: any) =>
    immutable(store, path, value, DELETE);
