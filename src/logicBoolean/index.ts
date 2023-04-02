import { tokenize } from "./tokenizer";
import { Parser } from "./parser";

export const parse = (expr: string) => {
  const tokens = tokenize(expr).filter(x => x.type != "whiteSpace");
  const parser = new Parser(tokens);
  const [, node] = parser.parse();
  return node;
};