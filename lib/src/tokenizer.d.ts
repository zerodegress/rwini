import { Position } from "./util";
export type TokenType = "comment" | "bracketLeft" | "bracketRight" | "identifier" | "text" | "whiteSpace" | "newLine";
export type StateName = "start" | "comment" | "bracketLeft" | "bracketRight" | "identifier" | "text" | "whiteSpace" | "newLine" | "end";
export interface Token {
    type: TokenType;
    value: string;
    range: {
        start: Position;
        end: Position;
    };
}
//# sourceMappingURL=tokenizer.d.ts.map