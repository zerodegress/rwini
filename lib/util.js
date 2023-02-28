"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asErr = exports.err = exports.ok = exports.sameLineRange = exports.pipe = exports.doForEach = exports.matches = exports.match = exports.enumerate = void 0;
const _ = require("lodash");
const enumerate = (arr) => {
    return Array.from(arr.entries());
};
exports.enumerate = enumerate;
const match = (reg, text) => {
    const result = reg.exec(text);
    return {
        then: (callback) => result && callback(result),
    };
};
exports.match = match;
const matches = (text) => (tuples) => {
    for (const [reg, callback] of tuples) {
        const result = reg.exec(text);
        if (result) {
            callback(result);
            return;
        }
    }
};
exports.matches = matches;
const doForEach = (arr, funcs) => {
    _.zip(arr, funcs).forEach(([item, func]) => {
        if (item && func) {
            func(item);
        }
    });
};
exports.doForEach = doForEach;
const pipe = (start, ...transformers) => {
    let state = start;
    for (const trans of transformers) {
        state = trans(state);
    }
    return state;
};
exports.pipe = pipe;
const sameLineRange = (line, start, length) => {
    return {
        start: {
            line,
            column: start,
        },
        end: {
            line,
            column: start + length - 1,
        }
    };
};
exports.sameLineRange = sameLineRange;
const ok = (value) => {
    return {
        isOk: () => true,
        isErr: () => false,
        ifOk: (callback) => {
            callback(value);
        },
        ifErr: () => null,
        unwrap: () => value,
    };
};
exports.ok = ok;
const err = (error) => {
    return {
        isOk: () => false,
        isErr: () => true,
        ifOk: () => null,
        ifErr: (callback) => {
            callback(error);
        },
        unwrap: () => {
            throw error;
        },
    };
};
exports.err = err;
const asErr = (err) => {
    return {
        isOk: () => false,
        isErr: () => true,
        ifOk: () => null,
        ifErr: (callback) => {
            err.ifErr(error => callback(error));
        },
        unwrap: () => {
            throw err.unwrap();
        }
    };
};
exports.asErr = asErr;
