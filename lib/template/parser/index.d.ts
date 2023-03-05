import { Node } from "../../logicBoolean/parser";
import { Token } from "../tokenizer";
export type SequnceType = "plain" | "template";
export interface Sequnce {
    type: SequnceType;
    value?: string;
    template?: Node;
    range: [number, number];
}
export interface Parser {
    (input: Token[]): Sequnce[];
}
export declare const parse: Parser;
//# sourceMappingURL=index.d.ts.map