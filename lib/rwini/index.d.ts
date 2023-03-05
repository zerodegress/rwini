import { Node } from "./parser";
import { Value } from "./value";
export type Raw = Map<string, Map<string, string>>;
export type Rwini = Map<string, Map<string, Value>>;
export declare const combineRaw: (...raws: Raw[]) => Raw;
export declare const parseTreetoRaw: (node: Node) => Raw;
export declare const serializeRawToString: (raw: Raw) => string;
//# sourceMappingURL=index.d.ts.map