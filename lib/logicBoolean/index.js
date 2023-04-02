"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const tokenizer_1 = require("./tokenizer");
const parser_1 = require("./parser");
const parse = (expr) => {
    const tokens = (0, tokenizer_1.tokenize)(expr).filter(x => x.type != "whiteSpace");
    const parser = new parser_1.Parser(tokens);
    const [, node] = parser.parse();
    return node;
};
exports.parse = parse;
