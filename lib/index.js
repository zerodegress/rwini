"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIni = void 0;
const parser_1 = require("./rwini/parser");
const rwini_1 = require("./rwini");
const tokenizer_1 = require("./rwini/tokenizer");
const transformer_1 = require("./rwini/tokenizer/transformer");
const util_1 = require("./util");
const parseIni = (ini) => {
    const tokens = (0, util_1.pipe)((0, tokenizer_1.presetTokenizer)(ini), ...transformer_1.presetTransformers);
    const rIni = (0, parser_1.filterEmpty)((0, parser_1.flattenNode)("codeList", (0, parser_1.flattenNode)("rwini", [(0, parser_1.rwini)(tokens)[0]])));
    return (0, rwini_1.parseTreetoRaw)(rIni[0]);
};
exports.parseIni = parseIni;
