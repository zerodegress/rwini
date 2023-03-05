import { Token, Tokenizer, TokenType } from ".";
export declare const term: (text: string, type: TokenType) => Tokenizer;
export declare const regex: (reg: RegExp, type: TokenType) => Tokenizer;
export declare const templateLeft: Tokenizer;
export declare const templateRight: Tokenizer;
export declare const templateBody: Tokenizer;
export declare const templateOutside: Tokenizer;
export declare const tokenize: (text: string, basePosition?: number, isInTemplate?: boolean) => Token[];
//# sourceMappingURL=static.d.ts.map