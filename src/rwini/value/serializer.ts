import { Value, ValueType } from ".";

export interface Serializer {
  (input: Value): string;
}