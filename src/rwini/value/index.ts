import { Node as LogicNode } from "../../logicBoolean/parser";
import { Sequnce as TemplateSequnce } from "../../template/parser";

export type BasicValueType = 
  | "string"
  | "dynamicText"
  | "int"
  | "bool"
  | "float"
  | "unit"
  | "logic"
  | "logicBoolean"
  | "template"
  | "define"
  | "global"
  | "memory"
  | "unknown"

export type ValueType = 
  | BasicValueType
  | [BasicValueType]

export type RawMemoryType = 
  | "number"
  | "string"
  | "bool"
  | "unit"
  | "marker"

export type MemoryType = 
  | RawMemoryType
  | [RawMemoryType]

export const isRawMemoryType = (type: string): type is RawMemoryType => {
  if(["number", "string", "bool", "unit", "marker"].find(x => x == type)) {
    return true;
  } else {
    return false;
  }
};

export type BasicTypeMap<Type extends ValueType> = 
  Type extends "string" ? string
  : Type extends "dynamicText" ? TemplateSequnce
  : Type extends "template" ? TemplateSequnce
  : Type extends "bool" ? boolean
  : Type extends "int" ? number
  : Type extends "float" ? number
  : Type extends "unit" ? string
  : Type extends "define" ? string
  : Type extends "global" ? string
  : Type extends "memory" ? string
  : Type extends "logic" ? LogicNode
  : Type extends "logicBoolean" ? LogicNode
  : Type extends "unknown" ? string
  : never;

export type TypeMap<Type extends ValueType> =
  BasicTypeMap<Type> extends never ? 
    Type extends [infer I extends BasicValueType] ? BasicTypeMap<I> : never
    : BasicTypeMap<Type>

export interface Value<Type extends ValueType> {
  type: Type;
  value: TypeMap<Type>;
}