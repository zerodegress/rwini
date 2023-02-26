import { Node } from "./parser";
export type Raw = Map<string, Map<string, string>>;
export declare const parseTreetoRaw: (node: Node) => Raw;
export declare const serializeRawToString: (raw: Raw) => string;
//# sourceMappingURL=index.d.ts.map