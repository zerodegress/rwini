import { Token, TokenType } from "../tokenizer";
export type NodeType = "equals" | "notEquals" | "greaterThan" | "greaterThanEquals" | "lessThan" | "lessThanEquals" | "add" | "sub" | "multiply" | "divide" | "mod" | "empty" | "number" | "identifier" | "member" | "null" | "call" | "index" | "bool" | "sequence" | "stringLiteral" | "namedPara" | "paraList" | "or" | "and" | "not" | "parren" | "member" | "expr" | "assign" | "addAssign" | "subAssign" | "multiplyAssign" | "divideAssign" | "modAssign" | "nullCallParas";
export interface Node {
    type: NodeType;
    value?: string;
    children: Node[];
    range: [number, number];
}
export declare class ParseError extends Error {
    token?: Token;
    constructor(msg: string, token?: Token);
}
export type OpType = "notop" | "pre" | "sep" | "call";
export declare class Parser {
    ptr: number;
    tree: Node;
    stack: [OpType, Node][];
    input: Token[];
    nowNode: Node;
    recall: boolean;
    isCall: boolean;
    constructor(input: Token[], ptr?: number, recall?: boolean);
    getCurrent(): Token;
    ahead(): void;
    op(): void;
    match(type: TokenType, toType: NodeType, opType?: OpType): void;
    number(): void;
    bool(): void;
    nul(): void;
    identifier(): void;
    factor(): void;
    callRest(): void;
    call(): void;
    not(): void;
    mulRest(): void;
    mul(): void;
    addRest(): void;
    add(): void;
    noeqRest(): void;
    noeq(): void;
    eqRest(): void;
    eq(): void;
    andRest(): void;
    and(): void;
    orRest(): void;
    or(): void;
    assignRest(): void;
    assign(): void;
    listRest(): void;
    list(): void;
    parse(): [number, Node];
}
//# sourceMappingURL=index.d.ts.map