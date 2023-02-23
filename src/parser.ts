import { Rwini } from "./rwini";
import { Token } from "./tokenizer";

export interface Parser {
  (tokens: Token[]): Rwini;
}