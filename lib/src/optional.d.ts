export interface Optional<T> {
    readonly isSome: boolean;
    readonly isNone: boolean;
    readonly ifSome: (callback: (value: T) => void) => void;
    readonly ifNone: (callback: () => void) => void;
    readonly unwrap: () => T;
}
export declare const some: <T>(value: T) => Optional<T>;
export declare const none: <T>() => Optional<T>;
//# sourceMappingURL=optional.d.ts.map