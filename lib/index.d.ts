export type TokenType = "string";
export interface Position {
    line: number;
    column: number;
}
export declare const newPostion: (line: number, column: number) => {
    line: number;
    column: number;
};
export interface Token {
    type: TokenType;
    content: string;
    location: {
        start: Position;
        end: Position;
    };
}
//# sourceMappingURL=index.d.ts.map