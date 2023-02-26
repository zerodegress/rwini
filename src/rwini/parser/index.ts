import _ = require("lodash");
import { Token, TokenType } from "../tokenizer";
import { Range } from "../../util";

export type NodeType =
  | "rwini"
  | "section"
  | "sectionName"
  | "codeList"
  | "code"
  | "key"
  | "value"
  | "term"
  | "rwini"
  | "empty"
  | "identifier"

export interface Node {
  type: NodeType;
  children: Node[];
  value: string;
  range: Range;
}

export interface Parser {
  (tokens: Token[]): [Node, Token[]];
}

export interface NodesTransformer {
  (nodes: Node[]): Node[];
}

export class ParserError extends Error {
  token?: Token;
  constructor(msg: string, token?: Token) {
    super(msg);
    this.token = token;
  }
}

export const parsersPipe = (tokens: Token[], ...parsers: Parser[]): [Node[], Token[]] => {
  const nodes: Node[] = [];
  let nTokens = tokens;
  for(const parser of parsers) {
    const [node, iTokens] = parser(nTokens);
    nodes.push(node);
    nTokens = iTokens;
  }
  return [nodes, nTokens];
};

export const term = (type: TokenType, value: string): Parser => (tokens) => {
  if(tokens.length > 0) {
    const token = tokens.shift() as Token;
    if(token.type == type && token.value == value) {
      return [
        {
          type: "term",
          value: token.value,
          children: [],
          range: token.range,
        },
        tokens,
      ];
    } else {
      throw new ParserError(`expected "${value}", found "${token.value}"`, token);
    }
  } else {
    throw new ParserError("unexpected endding");
  }
};

export const varTerm = (tokenType: TokenType, nodeType: NodeType): Parser => (tokens) => {
  if(tokens.length > 0) {
    const token = tokens.shift() as Token;
    if(token.type == tokenType) {
      return [
        {
          type: nodeType,
          value: token.value,
          children: [],
          range: token.range,
        },
        tokens,
      ];
    } else {
      throw new ParserError(`expected term ${tokenType}, found "${token.value}" as ${token.type}`, token);
    }
  } else {
    throw new ParserError("unexpected endding");
  }
};

export const opt = (parser: Parser, type?: TokenType): Parser => (tokens) => {
  if(tokens.length > 0 && (type ? tokens[0].type == type : true)) {
    return parser(tokens);
  } else {
    return [
      {
        type: "empty",
        value: "",
        children: [],
        range: {start:{line:-1,column:-1},end:{line:-1,column:-1}}
      }, 
      tokens
    ];
  }
};

export const identifier = varTerm("identifier", "identifier");
export const key = varTerm("identifier", "key");
export const valueParser = varTerm("value", "value");

export const sectionName: Parser = (tokens) => {
  const token = _.head(tokens) as Token;
  const [nodes, nTokens] = (() => {
    switch(token.type) {
      case "bracketLeft":
        return parsersPipe(
          tokens,
          term("bracketLeft", "["),
          identifier,
          term("bracketRight", "]"),
        );
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
      } as Range,
    },
    nTokens,
  ];
};

export const code: Parser = (tokens) => {
  const token = _.head(tokens) as Token;
  const [nodes, nTokens] = (() => {
    switch(token.type) {
      case "identifier":
        return parsersPipe(
          tokens,
          key,
          valueParser,
        );
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
      } as Range,
    },
    nTokens,
  ];
};

export const codeList: Parser = (tokens) => {
  const [nodes, nTokens] = (() => {
    return parsersPipe(
      tokens,
      code,
      opt(codeList, "identifier"),
    );
  })();
  return [
    {
      type: "codeList",
      value: "",
      children: nodes,
      range: {
        start: _.head(nodes)?.range.start, 
        end: _.last(nodes)?.range.end,
      } as Range,
    },
    nTokens,
  ];
};

export const section: Parser = (tokens) => {
  const [nodes, nTokens] = (() => {
    return parsersPipe(
      tokens,
      sectionName,
      opt(codeList, "identifier"),
    );
  })();
  return [
    {
      type: "section",
      value: nodes[0].value,
      children: nodes,
      range: {
        start: _.head(nodes)?.range.start, 
        end: _.last(nodes)?.range.end,
      } as Range,
    },
    nTokens,
  ];
};

export const rwini: Parser = (tokens) => {
  const [nodes, nTokens] = (() => {
    return parsersPipe(
      tokens,
      section,
      opt(rwini, "bracketLeft"),
    );
  })();
  return [
    {
      type: "rwini",
      value: "",
      children: nodes,
      range: {
        start: _.head(nodes)?.range.start, 
        end: _.last(nodes)?.range.end,
      } as Range,
    },
    nTokens,
  ];
};

export const filterEmpty: NodesTransformer = (nodes) => {
  return nodes
    .filter(node => node.type != "empty")
    .map(node => ({
      ...node,
      children: filterEmpty(node.children),
    }));
};

export const flattenNode = (type: NodeType, nodes: Node[]): Node[] => {
  return nodes
    .map(node => {
      const nChildren: Node[] = [];
      for(const child of flattenNode(type, node.children)) {
        if(child.type == type) {
          child.children.forEach(x => nChildren.push(x));
        } else {
          nChildren.push({
            ...child,
            children: flattenNode(type, child.children)
          });
        }
      }
      return {
        ...node,
        children: nChildren,
      };
    });
};

export const visitTree = (
  tree: Node, 
  callback: (current: Node, chain: Node[]) => void,
  chain?: Node[],
) => {
  callback(tree, [...(chain || [])]);
  for(const node of tree.children) {
    visitTree(node, callback, [...(chain || []), tree]);
  }
};