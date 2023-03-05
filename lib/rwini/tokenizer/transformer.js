"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presetTransformers = exports.filterComments = exports.filterKeyValueSymbol = exports.filterNewLine = exports.filterWhitespace = exports.concatSectionComment = exports.concatMultilineValue = exports.splitTripleQuotes = void 0;
const _1 = require(".");
const splitTripleQuotes = (tokens) => {
    const nTokens = [];
    for (const token of tokens) {
        if (token.type != "value" && token.type != "text") {
            nTokens.push(token);
        }
        else {
            const res = Array.from(token.value.match(/(""")|(''')/g) || []);
            if (res.length > 0) {
                const splits = token.value.split(/(""")|(''')/g).filter(x => x);
                const suffixTokens = [];
                const pos = token.range.start;
                for (const split of splits) {
                    const start = { ...pos };
                    const end = {
                        line: pos.line,
                        column: pos.column + split.length - 1,
                    };
                    if (split.length > 0) {
                        suffixTokens.push({
                            type: split.match(/(""")|(''')/) ? "tripleQuotes" : "value",
                            value: split,
                            range: {
                                start,
                                end,
                            }
                        });
                    }
                    pos.line = end.line;
                    pos.column = end.column + 1;
                }
                nTokens.push(...suffixTokens);
            }
            else {
                nTokens.push(token);
            }
        }
    }
    return nTokens;
};
exports.splitTripleQuotes = splitTripleQuotes;
const concatMultilineValue = (tokens) => {
    const nTokens = [];
    const states = {
        tokensCache: [],
        almostEnd: false,
        may: false,
    };
    for (const token of tokens) {
        if (states.tokensCache.length > 0) {
            switch (token.type) {
                case "tripleQuotes":
                    states.almostEnd = !states.almostEnd;
                    states.may = false;
                    states.tokensCache.push(token);
                    break;
                case "newLine":
                    if (states.almostEnd) {
                        if (states.may) {
                            nTokens.push(...states.tokensCache);
                            nTokens.push(token);
                            states.may = false;
                            states.tokensCache = [];
                            break;
                        }
                        nTokens.push({
                            type: "value",
                            value: states.tokensCache.map(x => x.value).join(""),
                            range: {
                                start: states.tokensCache[0].range.start,
                                end: states.tokensCache.at(-1).range.end,
                            }
                        });
                        nTokens.push(token);
                        states.tokensCache = [];
                        states.almostEnd = false;
                    }
                    else {
                        states.tokensCache.push(token);
                    }
                    break;
                default:
                    states.tokensCache.push(token);
            }
        }
        else if (token.type == "tripleQuotes") {
            states.tokensCache.push(token);
            states.almostEnd = false;
        }
        else if (token.type == "value") {
            states.tokensCache.push(token);
            states.may = true;
            states.almostEnd = true;
        }
        else {
            nTokens.push(token);
        }
    }
    if (states.tokensCache.length > 0) {
        throw new _1.TokenizeError("triple quotes should ends here", states.tokensCache.at(-1));
    }
    return nTokens;
};
exports.concatMultilineValue = concatMultilineValue;
const concatSectionComment = (tokens) => {
    const nTokens = [];
    const states = {
        tokensCache: []
    };
    for (const token of tokens) {
        if (states.tokensCache.length > 0) {
            if (token.type != "section") {
                states.tokensCache.push(token);
            }
            else {
                nTokens.push({
                    type: "comment",
                    value: states.tokensCache.map(x => x.value).join(""),
                    range: {
                        start: states.tokensCache[0].range.start,
                        end: states.tokensCache.at(-1).range.end,
                    },
                });
                states.tokensCache = [];
                if (token.type == "section" && token.value.startsWith("comment")) {
                    states.tokensCache.push(token);
                }
                else {
                    nTokens.push(token);
                }
            }
        }
        else if (token.type == "section" && token.value.startsWith("comment")) {
            states.tokensCache.push(token);
        }
        else {
            nTokens.push(token);
        }
    }
    if (states.tokensCache.length > 0) {
        nTokens.push({
            type: "comment",
            value: states.tokensCache.map(x => x.value).join(""),
            range: {
                start: states.tokensCache[0].range.start,
                end: states.tokensCache[1].range.end,
            },
        });
    }
    return nTokens;
};
exports.concatSectionComment = concatSectionComment;
const filterWhitespace = (tokens) => {
    return tokens.filter(token => !(token.type == "whiteSpace"));
};
exports.filterWhitespace = filterWhitespace;
const filterNewLine = (tokens) => {
    return tokens.filter(token => !(token.type == "newLine"));
};
exports.filterNewLine = filterNewLine;
const filterKeyValueSymbol = (tokens) => {
    return tokens.filter(token => !(token.type == "keyValueSymbol"));
};
exports.filterKeyValueSymbol = filterKeyValueSymbol;
const filterComments = (tokens) => {
    return tokens.filter(token => !(token.type == "comment"));
};
exports.filterComments = filterComments;
exports.presetTransformers = [
    exports.splitTripleQuotes,
    exports.concatMultilineValue,
    exports.concatSectionComment,
    exports.filterWhitespace,
    exports.filterNewLine,
    exports.filterComments,
    exports.filterKeyValueSymbol,
];
