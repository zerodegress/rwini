export type TokenType = "number" | "bool" | "stringLiteral" | "parrenLeft" | "parrenRight" | "bracketLeft" | "bracketRight" | "comma" | "equals" | "notEquals" | "lessThan" | "greaterThan" | "lessThanEquals" | "greaterThanEquals" | "plus" | "minus" | "multiply" | "divide" | "mod" | "if" | "and" | "or" | "not" | "whiteSpace" | "identifier" | "dot" | "null" | "empty" | "assign" | "addAssign" | "subAssign" | "multiplyAssign" | "divideAssign" | "modAssign";
export interface Token {
    type: TokenType;
    value?: string;
    range: [number, number];
}
export interface Tokenizer {
    (input: string, basePosition: number): [Token | undefined, string];
}
export declare const term: (text: string, type: TokenType) => Tokenizer;
export declare const regex: (reg: RegExp, type: TokenType) => Tokenizer;
export declare const number: Tokenizer;
export declare const stringLiteral: Tokenizer;
export declare const parrenLeft: Tokenizer;
export declare const parrenRight: Tokenizer;
export declare const bracketLeft: Tokenizer;
export declare const bracketRight: Tokenizer;
export declare const bool: Tokenizer;
export declare const if_: Tokenizer;
export declare const and: Tokenizer;
export declare const not: Tokenizer;
export declare const or: Tokenizer;
export declare const null_: Tokenizer;
export declare const comma: Tokenizer;
export declare const equals: Tokenizer;
export declare const notEquals: Tokenizer;
export declare const greaterThan: Tokenizer;
export declare const lessThan: Tokenizer;
export declare const greaterThanEquals: Tokenizer;
export declare const lessThanEquals: Tokenizer;
export declare const plus: Tokenizer;
export declare const minus: Tokenizer;
export declare const multiply: Tokenizer;
export declare const divide: Tokenizer;
export declare const mod: Tokenizer;
export declare const dot: Tokenizer;
export declare const identifier: Tokenizer;
export declare const whiteSpace: Tokenizer;
export declare const assign: Tokenizer;
export declare const addAssign: Tokenizer;
export declare const subAssign: Tokenizer;
export declare const multiplyAssign: Tokenizer;
export declare const divideAssign: Tokenizer;
export declare const modAssign: Tokenizer;
export declare const tokenizers: Tokenizer[];
export declare const tokenize: (text: string, basePosition?: number) => Token[];
//# sourceMappingURL=index.d.ts.map