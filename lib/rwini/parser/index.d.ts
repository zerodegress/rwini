import { Token, TokenType } from "../tokenizer";
import { Range } from "../../util";
export type NodeType = "rwini" | "section" | "sectionName" | "codeList" | "code" | "key" | "value" | "term" | "rwini" | "empty" | "identifier";
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
export declare class ParserError extends Error {
    token?: Token;
    constructor(msg: string, token?: Token);
}
export declare const parsersPipe: (tokens: Token[], ...parsers: Parser[]) => [Node[], Token[]];
export declare const term: (type: TokenType, value: string) => Parser;
export declare const varTerm: (tokenType: TokenType, nodeType: NodeType) => Parser;
export declare const opt: (parser: Parser, type?: TokenType) => Parser;
export declare const identifier: Parser;
export declare const key: Parser;
export declare const valueParser: Parser;
export declare const sectionName: Parser;
export declare const code: Parser;
export declare const codeList: Parser;
export declare const section: Parser;
export declare const rwini: Parser;
export declare const filterEmpty: NodesTransformer;
export declare const flattenNode: (type: NodeType, nodes: Node[]) => Node[];
export declare const visitTree: (tree: Node, callback: (current: Node, chain: Node[]) => void, chain?: Node[]) => void;
//# sourceMappingURL=index.d.ts.map