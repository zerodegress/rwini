import { describe, it, expect } from "@jest/globals";
import * as fs from "fs-extra";
import * as path from "path";
import { presetTokenizer } from "../src/tokenizer";
import { presetTransformers } from "../src/tokenizer/transformer";
import { rwini, filterEmpty, ParserError } from "../src/parser";
import { pipe } from "../src/util";

describe("rwini()", () => {
  it("parses simple ini", () => {
    const tokens = pipe(presetTokenizer("[section]\nname:abc"), ...presetTransformers);
    const ini = rwini(tokens);
    expect(ini[0].children.find(x => x.type == "section")).not.toBe(undefined);
  });
  it("parses real ini", () => {
    const tokens = pipe(
      presetTokenizer(fs.readFileSync(path.join(__dirname, "./__samples__/test1.ini")).toString()), 
      ...presetTransformers
    );
    const ini = rwini(tokens);
    expect(ini[0].children.find(x => x.type == "section")).not.toBe(undefined);
  });
});