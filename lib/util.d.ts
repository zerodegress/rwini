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
export declare const sameLineRange: (line: number, start: number, length: number) => {
    start: Position;
    end: Position;
};
export interface Result<T, E = Error> {
    isOk: () => boolean;
    isErr: () => boolean;
    ifOk: (callback: (value: T) => void) => void;
    ifErr: (callback: (error: E) => void) => void;
    unwrap: () => T;
}
export declare const ok: <T, E = Error>(value: T) => Result<T, E>;
export declare const err: <T, E = Error>(error: E) => Result<T, E>;
export declare const asErr: <T1, T2, E = Error>(err: Result<T1, E>) => Result<T2, E>;
export type If<Type, Extends, Then, Or> = Type extends Extends ? Then : Or;
export type Only<Type, Extends, Then> = If<Type, Extends, Then, never>;
//# sourceMappingURL=util.d.ts.map