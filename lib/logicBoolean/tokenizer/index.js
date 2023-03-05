"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.tokenizers = exports.modAssign = exports.divideAssign = exports.multiplyAssign = exports.subAssign = exports.addAssign = exports.assign = exports.whiteSpace = exports.identifier = exports.dot = exports.mod = exports.divide = exports.multiply = exports.minus = exports.plus = exports.lessThanEquals = exports.greaterThanEquals = exports.lessThan = exports.greaterThan = exports.notEquals = exports.equals = exports.comma = exports.null_ = exports.or = exports.not = exports.and = exports.if_ = exports.bool = exports.bracketRight = exports.bracketLeft = exports.parrenRight = exports.parrenLeft = exports.stringLiteral = exports.number = exports.regex = exports.term = void 0;
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
exports.number = (0, exports.regex)(/^(([1-9][0-9]+)|([0-9]))(\.[0-9]+f?)?/, "number");
exports.stringLiteral = (0, exports.regex)(/^(("((\\")|([^"]))*")|('((\\')|([^']))*'))/, "stringLiteral");
exports.parrenLeft = (0, exports.term)("(", "parrenLeft");
exports.parrenRight = (0, exports.term)(")", "parrenRight");
exports.bracketLeft = (0, exports.term)("[", "bracketLeft");
exports.bracketRight = (0, exports.term)("]", "bracketRight");
exports.bool = (0, exports.regex)(/^(true)|(false)/, "bool");
exports.if_ = (0, exports.term)("if", "if");
exports.and = (0, exports.term)("and", "and");
exports.not = (0, exports.term)("not", "not");
exports.or = (0, exports.term)("or", "or");
exports.null_ = (0, exports.term)("null", "null");
exports.comma = (0, exports.term)(",", "comma");
exports.equals = (0, exports.term)("==", "equals");
exports.notEquals = (0, exports.term)("!=", "notEquals");
exports.greaterThan = (0, exports.term)(">", "greaterThan");
exports.lessThan = (0, exports.term)("<", "lessThan");
exports.greaterThanEquals = (0, exports.term)(">=", "greaterThanEquals");
exports.lessThanEquals = (0, exports.term)("<=", "lessThanEquals");
exports.plus = (0, exports.term)("+", "plus");
exports.minus = (0, exports.term)("-", "minus");
exports.multiply = (0, exports.term)("*", "multiply");
exports.divide = (0, exports.term)("/", "divide");
exports.mod = (0, exports.term)("%", "mod");
exports.dot = (0, exports.term)(".", "dot");
exports.identifier = (0, exports.regex)(/^(([^\s=+\-*/()[\]\\/:;'",.!~@#$%^&*]+)|([^\s=+\-*/()[\]\\/:;'",.!~@#$%^&*0-9]))/, "identifier");
exports.whiteSpace = (0, exports.regex)(/^\s*/, "whiteSpace");
exports.assign = (0, exports.term)("=", "assign");
exports.addAssign = (0, exports.term)("+=", "addAssign");
exports.subAssign = (0, exports.term)("-=", "subAssign");
exports.multiplyAssign = (0, exports.term)("*=", "multiplyAssign");
exports.divideAssign = (0, exports.term)("/=", "divideAssign");
exports.modAssign = (0, exports.term)("%=", "modAssign");
exports.tokenizers = [
    exports.number,
    exports.stringLiteral,
    exports.parrenLeft,
    exports.parrenRight,
    exports.bracketLeft,
    exports.bracketRight,
    exports.bool,
    exports.if_,
    exports.and,
    exports.not,
    exports.or,
    exports.null_,
    exports.comma,
    exports.equals,
    exports.notEquals,
    exports.greaterThan,
    exports.greaterThanEquals,
    exports.lessThan,
    exports.lessThanEquals,
    exports.assign,
    exports.addAssign,
    exports.subAssign,
    exports.multiplyAssign,
    exports.divideAssign,
    exports.modAssign,
    exports.plus,
    exports.minus,
    exports.multiply,
    exports.divide,
    exports.mod,
    exports.dot,
    exports.identifier,
    exports.whiteSpace,
];
const tokenize = (text, basePosition = 1) => {
    if (text.length == 0) {
        return [];
    }
    const [result, rest] = (() => {
        for (const tokenizer of exports.tokenizers) {
            const [result, rest] = tokenizer(text, basePosition);
            if (result) {
                return [result, rest];
            }
        }
        throw new Error("unreachable!");
    })();
    return [result, ...(0, exports.tokenize)(rest, result.range[1] + 1)];
};
exports.tokenize = tokenize;
