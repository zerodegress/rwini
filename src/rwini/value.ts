export type VaueType = 
  | "string"

export type RawMemoryType = 
  | "number"
  | "string"
  | "bool"
  | "unit"
  | "marker"

export const isRawMemoryType = (type: string): type is RawMemoryType => {
  if(["number", "string", "bool", "unit", "marker"].find(x => x == type)) {
    return true;
  } else {
    return false;
  }
};