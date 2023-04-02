import { describe, it, expect } from "@jest/globals";
import { tokenize as tokenizeStatic } from "../../src/template/tokenizer/static";
import { tokenize as tokenizeDynamic } from "../../src/template/tokenizer/dynamic";

describe("static#tokenize()", () => {
  it("works", () => {
    const test = tokenizeStatic("abc${abc}abc");
  });
});

describe("dynamic#tokenize()", () => {
  it("works", () => {
    const test = tokenizeDynamic("abc%{'{abc}'}abc");
  });
});