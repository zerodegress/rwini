import { describe, it, expect } from "@jest/globals";
import { tokenize } from "../../src/logicBoolean/tokenizer";
import { Parser } from "../../src/logicBoolean/parser";

describe("addExpr()", () => {
  it("works", () => {
    const tokens = tokenize("a = a + a * (a * a / 2) + 5 + abc(b,a=a) + c() + index[c]").filter(x => x.type != "whiteSpace");
    const parser = new Parser(tokens);
    parser.parse();
  });
});