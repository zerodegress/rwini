import { describe, it, expect } from "@jest/globals";
import { presetTokenizer } from "../src/rwini/tokenizer";
import { presetTransformers } from "../src/rwini/tokenizer/transformer";
import { pipe } from "../src/util";
import * as fs from "fs-extra";
import * as path from "path";

describe("presetTokenizer", () => {
  it("tokenizes simple ini", () => {
    const tokens = presetTokenizer("[section]\nname:abc");
    expect(
      tokens.find(
        x => x.type == "identifier" && x.value == "section"
      )?.range
    ).toEqual({
      start: {line: 1, column: 2},
      end: {line: 1, column: 8},
    });
    expect(
      tokens.find(
        x => x.type == "identifier" && x.value == "name"
      )?.range
    ).toEqual({
      start: {line: 2, column: 1},
      end: {line: 2, column: 4},
    });
  });
});

describe("presetTransformers", () => {
  it("transforms correctly", () => {
    const tokens = pipe(
      presetTokenizer("[section]\nmultiline:\"\"\"\naduiduidui\n\"\"\""), 
      ...presetTransformers
    );
    expect(tokens.find(x => x.value.startsWith("\"\"\""))?.range.start.line).toBe(2);
    expect(tokens.find(x => x.value.startsWith("\"\"\""))?.range.end.line).toBe(4);
    console.log(tokens);
  });
  it("targets correctly", () => {
    const ini = fs.readFileSync(path.join(__dirname, "./samples/test1.ini")).toString();
    const lines = ini.split("\n");
    const tokens = pipe(
      presetTokenizer(ini),
      ...presetTransformers
    );
    for(const token of tokens) {
      if(token.type == "newLine") {
        continue;
      }
    }
    console.log(tokens);
  });
});