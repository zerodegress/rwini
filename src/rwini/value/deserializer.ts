import { Value, ValueType } from ".";

export interface Deserializer<Type extends ValueType> {
  (input: string): Value<Type>;
}