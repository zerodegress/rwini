export type TokenType = "templateLeft" | "templateRight" | "templateBody" | "templateOutside";
export interface Token {
    type: TokenType;
    value?: string;
    range: [number, number];
}
export interface Tokenizer {
    (input: string, basePosition: number): [Token | undefined, string];
}
//# sourceMappingURL=index.d.ts.map