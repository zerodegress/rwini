import { describe, it, expect } from "@jest/globals";
import { tokenize } from "../../src/template/tokenizer/dynamic";
import { parse } from "../../src/template/parser";

describe("parse()", () => {
  it("works", () => {
    const test = tokenize("abc%{abc + abc}abc");
    const seqs = parse(test);
    console.log(seqs);
  });
});