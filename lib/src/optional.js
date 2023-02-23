"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.none = exports.some = void 0;
const some = (value) => {
    return {
        isSome: true,
        isNone: false,
        ifSome: (callback) => {
            callback(value);
        },
        ifNone: () => null,
        unwrap: () => value,
    };
};
exports.some = some;
const none = () => {
    return {
        isSome: false,
        isNone: true,
        ifSome: () => null,
        ifNone: (callback) => callback(),
        unwrap: () => { throw new Error("unwrap on none"); },
    };
};
exports.none = none;
