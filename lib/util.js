"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = exports.doForEach = exports.matches = exports.match = exports.enumerate = void 0;
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
