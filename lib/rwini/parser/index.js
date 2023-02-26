"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitTree = exports.flattenNode = exports.filterEmpty = exports.rwini = exports.section = exports.codeList = exports.code = exports.sectionName = exports.valueParser = exports.key = exports.identifier = exports.opt = exports.varTerm = exports.term = exports.parsersPipe = exports.ParserError = void 0;
const _ = require("lodash");
class ParserError extends Error {
    token;
    constructor(msg, token) {
        super(msg);
        this.token = token;
    }
}
exports.ParserError = ParserError;
const parsersPipe = (tokens, ...parsers) => {
    const nodes = [];
    let nTokens = tokens;
    for (const parser of parsers) {
        const [node, iTokens] = parser(nTokens);
        nodes.push(node);
        nTokens = iTokens;
    }
    return [nodes, nTokens];
};
exports.parsersPipe = parsersPipe;
const term = (type, value) => (tokens) => {
    if (tokens.length > 0) {
        const token = tokens.shift();
        if (token.type == type && token.value == value) {
            return [
                {
                    type: "term",
                    value: token.value,
                    children: [],
                    range: token.range,
                },
                tokens,
            ];
        }
        else {
            throw new ParserError(`expected "${value}", found "${token.value}"`, token);
        }
    }
    else {
        throw new ParserError("unexpected endding");
    }
};
exports.term = term;
const varTerm = (tokenType, nodeType) => (tokens) => {
    if (tokens.length > 0) {
        const token = tokens.shift();
        if (token.type == tokenType) {
            return [
                {
                    type: nodeType,
                    value: token.value,
                    children: [],
                    range: token.range,
                },
                tokens,
            ];
        }
        else {
            throw new ParserError(`expected term ${tokenType}, found "${token.value}" as ${token.type}`, token);
        }
    }
    else {
        throw new ParserError("unexpected endding");
    }
};
exports.varTerm = varTerm;
const opt = (parser, type) => (tokens) => {
    if (tokens.length > 0 && (type ? tokens[0].type == type : true)) {
        return parser(tokens);
    }
    else {
        return [
            {
                type: "empty",
                value: "",
                children: [],
                range: { start: { line: -1, column: -1 }, end: { line: -1, column: -1 } }
            },
            tokens
        ];
    }
};
exports.opt = opt;
exports.identifier = (0, exports.varTerm)("identifier", "identifier");
exports.key = (0, exports.varTerm)("identifier", "key");
exports.valueParser = (0, exports.varTerm)("value", "value");
const sectionName = (tokens) => {
    const token = _.head(tokens);
    const [nodes, nTokens] = (() => {
        switch (token.type) {
            case "bracketLeft":
                return (0, exports.parsersPipe)(tokens, (0, exports.term)("bracketLeft", "["), exports.identifier, (0, exports.term)("bracketRight", "]"));
            default:
                throw new ParserError(`expected "[", found "${token.value}"`, token);
        }
    })();
    return [
        {
            type: "sectionName",
            value: nodes[1].value,
            children: nodes,
            range: {
                start: _.head(nodes)?.range.start,
                end: _.last(nodes)?.range.end,
            },
        },
        nTokens,
    ];
};
exports.sectionName = sectionName;
const code = (tokens) => {
    const token = _.head(tokens);
    const [nodes, nTokens] = (() => {
        switch (token.type) {
            case "identifier":
                return (0, exports.parsersPipe)(tokens, exports.key, exports.valueParser);
            default:
                throw new ParserError(`expected valid key, found "${token.value}"`, token);
        }
    })();
    return [
        {
            type: "code",
            value: nodes[0].value,
            children: nodes,
            range: {
                start: _.head(nodes)?.range.start,
                end: _.last(nodes)?.range.end,
            },
        },
        nTokens,
    ];
};
exports.code = code;
const codeList = (tokens) => {
    const [nodes, nTokens] = (() => {
        return (0, exports.parsersPipe)(tokens, exports.code, (0, exports.opt)(exports.codeList, "identifier"));
    })();
    return [
        {
            type: "codeList",
            value: "",
            children: nodes,
            range: {
                start: _.head(nodes)?.range.start,
                end: _.last(nodes)?.range.end,
            },
        },
        nTokens,
    ];
};
exports.codeList = codeList;
const section = (tokens) => {
    const [nodes, nTokens] = (() => {
        return (0, exports.parsersPipe)(tokens, exports.sectionName, (0, exports.opt)(exports.codeList, "identifier"));
    })();
    return [
        {
            type: "section",
            value: nodes[0].value,
            children: nodes,
            range: {
                start: _.head(nodes)?.range.start,
                end: _.last(nodes)?.range.end,
            },
        },
        nTokens,
    ];
};
exports.section = section;
const rwini = (tokens) => {
    const [nodes, nTokens] = (() => {
        return (0, exports.parsersPipe)(tokens, exports.section, (0, exports.opt)(exports.rwini, "bracketLeft"));
    })();
    return [
        {
            type: "rwini",
            value: "",
            children: nodes,
            range: {
                start: _.head(nodes)?.range.start,
                end: _.last(nodes)?.range.end,
            },
        },
        nTokens,
    ];
};
exports.rwini = rwini;
const filterEmpty = (nodes) => {
    return nodes
        .filter(node => node.type != "empty")
        .map(node => ({
        ...node,
        children: (0, exports.filterEmpty)(node.children),
    }));
};
exports.filterEmpty = filterEmpty;
const flattenNode = (type, nodes) => {
    return nodes
        .map(node => {
        const nChildren = [];
        for (const child of (0, exports.flattenNode)(type, node.children)) {
            if (child.type == type) {
                child.children.forEach(x => nChildren.push(x));
            }
            else {
                nChildren.push({
                    ...child,
                    children: (0, exports.flattenNode)(type, child.children)
                });
            }
        }
        return {
            ...node,
            children: nChildren,
        };
    });
};
exports.flattenNode = flattenNode;
const visitTree = (tree, callback, chain) => {
    callback(tree, [...(chain || [])]);
    for (const node of tree.children) {
        (0, exports.visitTree)(node, callback, [...(chain || []), tree]);
    }
};
exports.visitTree = visitTree;
