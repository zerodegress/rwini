import { describe, it, expect } from "@jest/globals";
import * as fs from "fs-extra";
import * as path from "path";
import { presetTokenizer } from "../src/rwini/tokenizer";
import { presetTransformers } from "../src/rwini/tokenizer/transformer";
import { rwini, flattenNode, filterEmpty } from "../src/rwini/parser";
import { pipe } from "../src/util";
import { scan } from "../src/rwini/scanner";
import { parseTreetoRaw } from "../src/rwini";

describe("parseTree()", () => {
  it("parses real tree", () => {
    const tokens = pipe(
      presetTokenizer(fs.readFileSync(path.join(__dirname, "./samples/test1.ini")).toString()), 
      ...presetTransformers,
    );
    const ini = rwini(tokens);
    expect(ini[0].children.find(x => x.type == "rwini")).not.toBe(undefined);
    expect(ini[0].children.find(x => x.type == "empty")).toBe(undefined);
    const rIni = filterEmpty(flattenNode("codeList", flattenNode("rwini", [ini[0]])));
    expect(rIni.length > 0).toBe(true);
    const scanResult = scan(parseTreetoRaw(rIni[0]));
    console.log(scanResult);
    expect(scanResult).not.toBe(undefined);
  });
});