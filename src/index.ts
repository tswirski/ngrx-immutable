// @ts-ignore
type findIndexFunction = (elemen: any, index: number, collection: []) => number;
type oPathElement = string | number;
type iPathElement = oPathElement | findIndexFunction;

const getNestedObject = (obj: object, path: oPathElement[]) => {
    return path.reduce((_obj: any, key: any) => (_obj && _obj[key] !== 'undefined' ? _obj[key] : undefined), obj);
};

const getObjectPath = (obj: object, path: Array<iPathElement>): oPathElement[] => {
    return path.reduce((accumulator: oPathElement[], pathElement: iPathElement): oPathElement[] => {
        const _obj = getNestedObject(obj, accumulator as string[]);

        if (_obj === undefined) {
            throw Error(`[immute] invalid path, "[${accumulator.join(', ')}]" does not exists`);
        }

        switch (typeof pathElement) {
            case 'string':
            case 'number':
                // @ts-ignore
                if (!_obj[pathElement] === undefined) {
                    throw Error(
                        `[immute] invalid path, "[${[...accumulator, pathElement].join(', ')}]" does not exists`
                    );
                }
                return [...accumulator, pathElement] as string[];

            case 'function':
                if (!Array.isArray(_obj)) {
                    throw Error(
                        `[immute] not iterable, element at location "[${accumulator.join(', ')}]" is not array`
                    );
                }
                // @ts-ignore
                const index = (_obj as Array<any>).findIndex(pathElement as any);

                if (index === -1) {
                    throw Error(
                        `[immute] invalid index, can not find element in collection "[${accumulator.join(', ')}]"`
                    );
                }

                return [...accumulator, index];

            default:
                throw Error(`[immute] invalid path, "${typeof pathElement}" is neither "string" nor "function"`);
        }
    }, []);
};

const getImmutedObject = (store: object | [any], path: iPathElement[], value: any): object | [any] => {
    if (path.length === 0) {
        return value;
    }

    const _path: oPathElement[] = getObjectPath(store, path);
    // @ts-ignore
    const parent: object | [] = getNestedObject(store, _path.slice(0, -1));
    const object: any = getNestedObject(store, _path);
    const selector: oPathElement = _path[_path.length - 1];
    const _ref = typeof selector === 'number' ? [] : {};
    const _value: any = typeof value === 'function' ? value(object) : value;
    // @ts-ignore
    let _parent: any = Object.assign(_ref, parent, { [selector]: _value });

    if (_value === undefined) {
        if (typeof selector === 'number') {
            // @ts-ignore
            _parent = (_parent as []).filter(el => el !== undefined);
        } else {
            const { [selector]: nil, ...__parent } = _parent;
            _parent = __parent;
        }
    }

    Object.freeze(_parent);
    return getImmutedObject(store, path.slice(0, -1), _parent);
};

export const immute = (store: object | [any], path: iPathElement[], value: any): object | [any] => {
    if (path.length === 0) {
        throw Error(`[immute] invalid path, empty`);
    }

    return getImmutedObject(store, path, value);
};
