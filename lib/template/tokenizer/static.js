"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.templateOutside = exports.templateBody = exports.templateRight = exports.templateLeft = exports.regex = exports.term = void 0;
const term = (text, type) => (input, basePosition = 1) => {
    if (input.startsWith(text)) {
        return [{
                type,
                range: [basePosition, basePosition + text.length - 1]
            }, input.replace(text, "")];
    }
    else {
        return [undefined, input];
    }
};
exports.term = term;
const regex = (reg, type) => (input, basePosition = 1) => {
    const res = reg.exec(input);
    if (res) {
        return [{
                type,
                value: res[0],
                range: [basePosition, basePosition + res[0].length - 1]
            }, input.replace(reg, "")];
    }
    else {
        return [undefined, input];
    }
};
exports.regex = regex;
exports.templateLeft = (0, exports.term)("${", "templateLeft");
exports.templateRight = (0, exports.term)("}", "templateRight");
exports.templateBody = (0, exports.regex)(/^[^}]*/, "templateBody");
exports.templateOutside = (0, exports.regex)(/^((?!\$\{).)*/, "templateOutside");
const tokenize = (text, basePosition = 1, isInTemplate = false) => {
    if (text.length == 0) {
        return [];
    }
    if (!isInTemplate) {
        const [result, rest] = (0, exports.templateOutside)(text, basePosition);
        if (!result) {
            throw new Error("unreachable!");
        }
        if (rest.length == 0) {
            return [result];
        }
        else {
            const [nResult, nRest] = (0, exports.templateLeft)(rest, result.range[1] + 1);
            if (!nResult) {
                throw new Error("unreachable!");
            }
            return [result, nResult, ...(0, exports.tokenize)(nRest, nResult.range[1] + 1, !isInTemplate)];
        }
    }
    else {
        const [result, rest] = (0, exports.templateBody)(text, basePosition);
        if (!result) {
            throw new Error("unreachable!");
        }
        if (rest.length == 0) {
            throw new Error("unexpected template ending!");
        }
        else {
            const [nResult, nRest] = (0, exports.templateRight)(rest, result.range[1] + 1);
            if (!nResult) {
                throw new Error("unreachable!");
            }
            return [result, nResult, ...(0, exports.tokenize)(nRest, nResult.range[1] + 1, !isInTemplate)];
        }
    }
};
exports.tokenize = tokenize;
