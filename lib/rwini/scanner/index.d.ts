import { Node } from "../parser";
import { RawMemoryType } from "../../value";
export interface SectionSymbol {
    id: number;
    rawName: string;
    mainName: string;
    subName: string;
}
export interface CodeSymbol {
    scopeId: number;
    id: number;
    key: string;
}
export interface DefineSymbol {
    scopeId: number;
    id: number;
    name: string;
    value: string;
}
export interface MemorySymbol {
    scopeId: number;
    id: number;
    name: string;
    type: RawMemoryType;
}
export interface ScopeSymbol {
    type: "mod" | "template" | "file" | "section" | "value";
    id: number;
    name: string;
}
export interface SymbolTable {
    sections: SectionSymbol[];
    codes: CodeSymbol[];
    defines: DefineSymbol[];
    memories: MemorySymbol[];
    scopes: ScopeSymbol[];
}
export declare const scanNode: (node: Node) => SymbolTable;
export declare class ScanError extends Error {
    node: Node;
    constructor(msg: string, node: Node);
}
//# sourceMappingURL=index.d.ts.map