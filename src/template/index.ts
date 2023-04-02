import { tokenize as tokenizeStatic } from "./tokenizer/static";
import { tokenize as tokenizeDynamic } from "./tokenizer/dynamic";
import { parse } from "./parser";


export const parseStatic = (text: string) => {
  const tokens = tokenizeStatic(text);
  const seqs = parse(tokens);
  return seqs;
};

export const parseDynamic = (text: string) => {
  const tokens = tokenizeDynamic(text);
  const seqs = parse(tokens);
  return seqs;
};