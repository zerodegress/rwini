import type { Position } from "../../util";
export declare const SECTION_REG: RegExp;
export declare const CODE_REG: RegExp;
export declare const EMPTY_REG: RegExp;
export declare const TEXT_REG: RegExp;
export type TokenType = "comment" | "bracketLeft" | "bracketRight" | "identifier" | "text" | "section" | "key" | "value" | "semicolon" | "keyValueSymbol" | "whiteSpace" | "newLine" | "tripleQuotes";
export interface Token {
    type: TokenType;
    value: string;
    range: {
        start: Position;
        end: Position;
    };
}
export interface Tokenizer {
    (text: string): Token[];
}
export interface TokensTransformer {
    (tokens: Token[]): Token[];
}
export declare class TokenizeError extends Error {
    token: Token;
    constructor(msg: string, token: Token);
}
export declare const presetTokenizer: Tokenizer;
//# sourceMappingURL=index.d.ts.map