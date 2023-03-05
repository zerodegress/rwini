import { Value } from ".";

export interface Deserializer {
  (input: string): Value;
}