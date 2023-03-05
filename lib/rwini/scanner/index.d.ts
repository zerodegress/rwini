import { Raw } from "..";
export interface Symbol {
    id: number;
    name: string;
    scope: number;
}
export interface DefineSymbol extends Symbol {
    type: "replace" | "memory" | "section" | "file" | "builtin";
    content: string;
}
export interface UseSymbol extends Symbol {
    type: "replace" | "memory" | "section" | "builtin" | "file";
    content: string;
}
export interface ScopeSymbol extends Symbol {
    type: "file" | "section" | "value";
    content: SymbolTable;
}
export interface CodeScanner {
    (input: [string, string], lastId: number, thisScope?: ScopeSymbol): [Partial<SymbolTable>, number];
}
export interface SymbolTable {
    defines: DefineSymbol[];
    uses: UseSymbol[];
    scopes: ScopeSymbol[];
}
export declare const replaceScanner: CodeScanner;
export declare const memoryScanner: CodeScanner;
export declare const copyFromSectionScanner: CodeScanner;
export declare const copyFromScanner: CodeScanner;
export declare const unitMemoriesScanner: CodeScanner;
export declare const presetScanners: CodeScanner[];
export declare const scan: (raw: Raw, scanners?: CodeScanner[], filename?: string) => SymbolTable;
//# sourceMappingURL=index.d.ts.map