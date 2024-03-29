import { describe, it, expect } from "@jest/globals";
import { tokenize } from "../../src/logicBoolean/tokenizer";
import { Parser } from "../../src/logicBoolean/parser";

describe("addExpr()", () => {
  it("works", () => {
    const tokens = tokenize("a*a+a,b+c").filter(x => x.type != "whiteSpace");
    const parser = new Parser(tokens);
    const [,node] = parser.parse();
  });
});