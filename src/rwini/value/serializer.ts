import { Value, ValueType } from ".";

export interface Serializer<Type extends ValueType> {
  (input: Value<Type>): string;
}