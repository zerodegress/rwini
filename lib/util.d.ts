export interface Position {
    line: number;
    column: number;
}
export interface Range {
    start: Position;
    end: Position;
}
export declare const enumerate: <T>(arr: T[]) => [number, T][];
export declare const match: (reg: RegExp, text: string) => {
    then: (callback: (res: RegExpExecArray) => void) => void | null;
};
export declare const matches: (text: string) => (tuples: [RegExp, (res: RegExpExecArray) => void][]) => void;
export declare const doForEach: <T>(arr: T[], funcs: ((value: T) => void)[]) => void;
export declare const pipe: <T>(start: T, ...transformers: ((value: T) => T)[]) => T;
//# sourceMappingURL=util.d.ts.map