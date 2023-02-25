import { describe, it, expect } from "@jest/globals";
import * as fs from "fs-extra";
import * as path from "path";
import { presetTokenizer } from "../src/tokenizer";
import { presetTransformers } from "../src/tokenizer/transformer";
import { rwini, flattenNode, filterEmpty, ParserError } from "../src/parser";
import { parseTree } from "../src/rwini";
import { pipe } from "../src/util";

describe("parseTree()", () => {
  it("parses real tree", () => {
    const tokens = pipe(
      presetTokenizer(fs.readFileSync(path.join(__dirname, "./__samples__/test1.ini")).toString()), 
      ...presetTransformers
    );
    const ini = rwini(tokens);
    expect(ini[0].children.find(x => x.type == "rwini")).not.toBe(undefined);
    expect(ini[0].children.find(x => x.type == "empty")).toBe(undefined);
    const rIni = filterEmpty(flattenNode("codeList", flattenNode("rwini", [ini[0]])));
    expect(rIni.length > 0).toBe(true);
    console.log(parseTree(rIni[0]));
  });
});