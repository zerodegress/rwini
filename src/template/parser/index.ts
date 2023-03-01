import { Node, Parser as TemplateParser } from "../../logicBoolean/parser";
import { tokenize as tokenizeTemplate } from "../../logicBoolean/tokenizer";
import { Token } from "../tokenizer";

export type SequnceType =
  | "plain"
  | "template"

export interface Sequnce {
  type: SequnceType;
  value?: string;
  template?: Node;
  range: [number, number];
}

export interface Parser {
  (input: Token[]): Sequnce[];
}

export const parse: Parser = (input) => {
  const seqs: Sequnce[] = [];
  for(const token of input) {
    switch(token.type) {
      case "templateOutside":
        seqs.push({
          type: "plain",
          value: token.value,
          range: token.range,
        });
        break;
      case "templateBody":
        {
          const tokens = tokenizeTemplate(token.value || "");
          const parser = new TemplateParser(tokens);
          const [, node] = parser.parse();
          seqs.push({
            type: "template",
            template: node,
            range: node.range,
          });
        }
        break;
    }
  }
  return seqs;
};