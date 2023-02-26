"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presetTokenizer = exports.TokenizeError = exports.TEXT_REG = exports.EMPTY_REG = exports.CODE_REG = exports.SECTION_REG = void 0;
const util = require("../../util");
exports.SECTION_REG = /^(\s*)(\[)([^[\]]+?)(\])(\s*)(#.*)?$/;
exports.CODE_REG = /^(\s*)([^:]+?)(:)(\s*)([^#]+)(#.*)?$/;
exports.EMPTY_REG = /^(\s*)(#.*)?$/;
exports.TEXT_REG = /^(.+)$/;
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
class TokenizeError extends Error {
    token;
    constructor(msg, token) {
        super(msg);
        this.name = "TokenizeError";
        this.token = token;
    }
}
exports.TokenizeError = TokenizeError;
const presetTokenizer = (text) => {
    const tokens = [];
    const lines = text.split("\n");
    for (const [lineNum, line] of lines.entries()) {
        const counter = {
            pos: 0,
            step(length) {
                this.pos += length;
                return length;
            }
        };
        const genRange = (value) => {
            return sameLineRange(lineNum + 1, counter.pos + 1, counter.step(value.length));
        };
        const toToken = (type) => (value) => value && value.length != 0 && tokens.push({
            type,
            value,
            range: genRange(value),
        });
        const toTokens = (...types) => types.map(type => toToken(type));
        util.matches(line)([
            [
                exports.EMPTY_REG,
                (res) => util.doForEach(res.slice(1), toTokens("whiteSpace", "comment"))
            ],
            [
                exports.SECTION_REG,
                (res) => util.doForEach(res.slice(1), toTokens("whiteSpace", "bracketLeft", "identifier", "bracketRight", "whiteSpace", "comment"))
            ],
            [
                exports.CODE_REG,
                (res) => util.doForEach(res.slice(1), toTokens("whiteSpace", "identifier", "keyValueSymbol", "whiteSpace", "value", "comment"))
            ],
            [
                exports.TEXT_REG,
                (res) => util.doForEach(res.slice(1), toTokens("text"))
            ],
        ]);
        tokens.push({
            type: "newLine",
            value: "\n",
            range: {
                start: {
                    line: lineNum,
                    column: counter.pos + 1
                },
                end: {
                    line: lineNum,
                    column: counter.pos + 1
                },
            }
        });
    }
    return tokens;
};
exports.presetTokenizer = presetTokenizer;
