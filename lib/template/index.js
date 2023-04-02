"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDynamic = exports.parseStatic = void 0;
const static_1 = require("./tokenizer/static");
const dynamic_1 = require("./tokenizer/dynamic");
const parser_1 = require("./parser");
const parseStatic = (text) => {
    const tokens = (0, static_1.tokenize)(text);
    const seqs = (0, parser_1.parse)(tokens);
    return seqs;
};
exports.parseStatic = parseStatic;
const parseDynamic = (text) => {
    const tokens = (0, dynamic_1.tokenize)(text);
    const seqs = (0, parser_1.parse)(tokens);
    return seqs;
};
exports.parseDynamic = parseDynamic;
