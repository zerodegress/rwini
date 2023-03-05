"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parser_1 = require("../../logicBoolean/parser");
const tokenizer_1 = require("../../logicBoolean/tokenizer");
const parse = (input) => {
    const seqs = [];
    for (const token of input) {
        switch (token.type) {
            case "templateOutside":
                seqs.push({
                    type: "plain",
                    value: token.value,
                    range: token.range,
                });
                break;
            case "templateBody":
                {
                    const tokens = (0, tokenizer_1.tokenize)(token.value || "");
                    const parser = new parser_1.Parser(tokens);
                    const [, node] = parser.parse();
                    seqs.push({
                        type: "template",
                        template: node,
                        range: node.range,
                    });
                }
                break;
        }
    }
    return seqs;
};
exports.parse = parse;
