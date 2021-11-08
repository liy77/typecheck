const arrayTypes = [
    "Array",
    "StringArray",
    "SymbolArray",
    "NumberArray",
    "FunctionArray",
    "ObjectArray",
    "BigIntArray",
    "BooleanArray",
];
export const fnIsObjectArray = (t) => {
    return t.name === "ObjectArray";
};
export const fnIsFunctionArray = (t) => {
    return t.name === "FunctionArray";
};
export const fnIsStringArray = (t) => {
    return t.name === "StringArray";
};
export const fnIsSymbolArray = (t) => {
    return t.name === "SymbolArray";
};
export const fnIsNumberArray = (t) => {
    return t.name === "NumberArray";
};
export const fnIsBigIntArray = (t) => {
    return t.name === "BigIntArray";
};
export const fnIsBooleanArray = (t) => {
    return t.name === "BooleanArray";
};
export const fnIsAnyArray = (t) => {
    return t.name === "Array";
};
const isArrayCustom = (type, arg) => {
    if (!Array.isArray(arg)) {
        return {
            valid: false,
            index: 0,
            type: typeof arg,
        };
    }
    else if (arg.length === 0) {
        return {
            valid: true,
            index: 0,
            type: "array",
        };
    }
    else {
        const x = arg.length++;
        for (let i = 0; i < x; i++) {
            if (typeof arg[i] !== type) {
                return {
                    valid: false,
                    index: i,
                    type: typeof arg[i],
                };
            }
        }
    }
    return {
        valid: true,
        index: 0,
        type: "array",
    };
};
export class ObjectArray extends Array {
    static isObjectArray(arg) {
        return isArrayCustom("object", arg).valid;
    }
}
export class FunctionArray extends Array {
    static isFunctionArray(arg) {
        return isArrayCustom("function", arg).valid;
    }
}
export class StringArray extends Array {
    static isStringArray(arg) {
        return isArrayCustom("string", arg).valid;
    }
}
export class SymbolArray extends Array {
    static isSymbolArray(arg) {
        return isArrayCustom("symbol", arg).valid;
    }
}
export class NumberArray extends Array {
    static isNumberArray(arg) {
        return isArrayCustom("number", arg).valid;
    }
}
export class BigIntArray extends Array {
    static isBigIntArray(arg) {
        return isArrayCustom("bigint", arg).valid;
    }
}
export class BooleanArray extends Array {
    static isBooleanArray(arg) {
        return isArrayCustom("boolean", arg).valid;
    }
}
export class Null extends null {
    static isNull(arg) {
        return arg === null;
    }
}
export class Undefined {
    static isUndefined(arg) {
        return typeof arg === "undefined";
    }
}
export class Enum extends Object {
    static isEnum(t) {
        if (typeof t !== "object") {
            return false;
        }
        const keys = Object.keys(t);
        for (const key of keys) {
            if (!isNaN(Number(key)) && typeof t[key] !== "string") {
                return false;
            }
            else if (isNaN(Number(key)) && typeof t[key] !== "number") {
                return false;
            }
        }
        return true;
    }
    static createEnum(array) {
        if (!StringArray.isStringArray(array)) {
            throw new TypeError("You can only create an Enum from a string array");
        }
        let enumObj = {};
        for (const [index, key] of Object.entries(array)) {
            enumObj[key] = Number(index);
            enumObj[index] = key;
        }
        return enumObj;
    }
}
export function TypeCheck(objWithTypes, obj) {
    const typeEntries = Object.entries(objWithTypes).filter(([key]) => !key.startsWith("_"));
    const throwErr = (message) => {
        throw new TypeError(message);
    };
    const makeErrorMessage = (key, type, received = typeof obj[key]) => {
        return `The "${key}" option must be a ${type.toLowerCase()}. But received type ${received}`;
    };
    const checkArrayTypes = (key, type) => {
        if (!fnIsAnyArray(type)) {
            const [name] = type.name.split("Array");
            const custom = isArrayCustom(name.toLowerCase(), obj[key]);
            if (!custom.valid) {
                const errorMessage = `The "${key}" option must be a ${name.toLowerCase()} array. But value "${custom.index}" in array is a ${custom.type}`;
                throwErr(errorMessage);
            }
            return true;
        }
        else if (Array.isArray(obj[key])) {
            return true;
        }
        else {
            return false;
        }
    };
    const checkArrayType = (key, type) => {
        type = type.toLowerCase();
        switch (type) {
            case "stringarray":
                return checkArrayTypes(key, StringArray);
            case "numberarray":
                return checkArrayTypes(key, NumberArray);
            case "symbolarray":
                return checkArrayTypes(key, SymbolArray);
            case "booleanarray":
                return checkArrayTypes(key, BooleanArray);
            case "functionarray":
                return checkArrayTypes(key, FunctionArray);
            case "bigintarray":
                return checkArrayTypes(key, BigIntArray);
            case "objectarray":
                return checkArrayTypes(key, ObjectArray);
            default:
                return checkArrayTypes(key, Array);
        }
    };
    for (const [key, value] of typeEntries) {
        // Verifies that the value of the type is a array, if it is start the type check
        if (Array.isArray(value)) {
            const types = value.map((type) => type.name.toLowerCase()); // Passing the type names to Lower Case
            const filtered = types.filter((type) => {
                if (arrayTypes.map((type) => type.toLowerCase()).includes(type)) {
                    checkArrayType(key, type);
                }
                else if ((type === "null" || type === "undefined") && !obj[key]) {
                    return true;
                }
                else if (type === Enum.name.toLowerCase()) {
                    return Enum.isEnum(obj[key]);
                }
                return typeof obj[key] === type;
            });
            if (filtered.length === 0) {
                const last = types.pop();
                let text;
                if (types.length < 1) {
                    text = last;
                }
                else {
                    text = `${types.join(", ")} or ${last}`;
                }
                throwErr(makeErrorMessage(key, text, Enum.isEnum(obj[key])
                    ? "enum"
                    : obj[key] === null
                        ? "null"
                        : undefined));
            }
        }
        // Verifies that the value of the type is a function, if it is start the type check
        if (typeof value === "function") {
            if (value.name.includes("Array")) {
                const [name] = value.name.split("Array");
                if (!Array.isArray(obj[key])) {
                    throwErr(makeErrorMessage(key, name !== "" ? `${name} array` : "array"));
                }
                checkArrayType(key, value.name);
            }
            else if (value.name && value.name === "Enum") {
                if (!Enum.isEnum(obj[key])) {
                    throwErr(makeErrorMessage(key, "enum"));
                }
            }
            else if (typeof obj[key] !== value.name?.toLowerCase()) {
                throwErr(makeErrorMessage(key, value.name, Enum.isEnum(obj[key]) ? "enum" : undefined));
            }
        }
    }
    return obj;
}
export default TypeCheck;
