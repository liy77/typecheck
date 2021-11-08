interface JSON {
  [x: string]: any;
}

export declare const fnIsObjectArray: (t: ArrayTypes) => boolean;
export declare const fnIsFunctionArray: (t: ArrayTypes) => boolean;
export declare const fnIsStringArray: (t: ArrayTypes) => boolean;
export declare const fnIsSymbolArray: (t: ArrayTypes) => boolean;
export declare const fnIsNumberArray: (t: ArrayTypes) => boolean;
export declare const fnIsBigIntArray: (t: ArrayTypes) => boolean;
export declare const fnIsBooleanArray: (t: ArrayTypes) => boolean;
export declare const fnIsAnyArray: (t: ArrayTypes) => boolean;

export declare class ObjectArray extends Array<Object> {
  static isObjectArray(arg: any): boolean;
}
export declare class FunctionArray extends Array<Function> {
  static isFunctionArray(arg: any): boolean;
}
export declare class StringArray extends Array<String> {
  static isStringArray(arg: any): boolean;
}
export declare class SymbolArray extends Array<Symbol> {
  static isSymbolArray(arg: any): boolean;
}
export declare class NumberArray extends Array<Number> {
  static isNumberArray(arg: any): boolean;
}
export declare class BigIntArray extends Array<BigInt> {
  static isBigIntArray(arg: any): boolean;
}
export declare class BooleanArray extends Array<Boolean> {
  static isBooleanArray(arg: any): boolean;
}
export declare class Null extends null {
  static isNull(arg: any): boolean;
}
export declare class Undefined {
  static isUndefined(arg: any): boolean;
}

export declare class Enum extends Object {
  static isEnum(t: any): boolean;
  static createEnum(array: string[]): {
    [x: string]: number | string;
  };
}

export declare function TypeCheck(
  objWithTypes: {
    [x: string]: validTypes | validTypes[];
  },
  obj: JSON
): JSON;

export default TypeCheck;

export declare type validTypes =
  | typeof Boolean
  | typeof String
  | typeof BigInt
  | typeof Number
  | typeof Function
  | typeof Symbol
  | typeof Object
  | typeof Enum
  | typeof Null
  | typeof Undefined
  | ArrayTypes;

export declare type ArrayTypes =
  | typeof Array
  | typeof ObjectArray
  | typeof FunctionArray
  | typeof NumberArray
  | typeof SymbolArray
  | typeof BigIntArray
  | typeof StringArray
  | typeof BooleanArray;
