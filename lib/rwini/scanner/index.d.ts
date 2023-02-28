import { Node } from "../parser";
import { RawMemoryType } from "../value";
export interface Symbol {
    id: number;
    name: string;
}
export interface ScopedSymbol extends Symbol {
    scopeId: number;
}
export interface SectionSymbol extends Symbol {
    mainName: string;
    subName: string;
}
export type CodeSymbol = ScopedSymbol;
export interface DefineSymbol extends ScopedSymbol {
    value: string;
}
export interface MemorySymbol extends ScopedSymbol {
    type: RawMemoryType;
}
export interface ScopeSymbol extends Symbol {
    type: "mod" | "template" | "file" | "section" | "value";
}
export type UseType = "define" | "memory";
export interface UseSymbol extends ScopedSymbol {
    type: UseType;
    useName: string;
    useFrom: Node;
}
export interface SymbolTable {
    sections: SectionSymbol[];
    codes: CodeSymbol[];
    defines: DefineSymbol[];
    memories: MemorySymbol[];
    scopes: ScopeSymbol[];
    uses: UseSymbol[];
}
export declare const scanNode: (node: Node) => SymbolTable;
export declare class ScanError extends Error {
    node: Node;
    constructor(msg: string, node: Node);
}
//# sourceMappingURL=index.d.ts.map