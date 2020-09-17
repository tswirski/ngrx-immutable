declare type findIndexFunction = (element: any, index: number, collection: []) => number;
declare type oPathElement = string | number;
declare type iPathElement = oPathElement | findIndexFunction;
declare type objectLike = {
    [index: string]: any;
} | any[number];
export declare const DELETE: unique symbol;
export declare function select(store: objectLike, path: iPathElement[]): any;
export declare const immute: (store: objectLike, path: iPathElement[], value: any) => any;
declare const _default: (store: objectLike, path: iPathElement[], value: any) => any;
export default _default;
