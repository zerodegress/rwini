import { rwini, filterEmpty, flattenNode } from "./parser";
import { parseTree, Rwini } from "./rwini";
import { presetTokenizer } from "./tokenizer";
import { presetTransformers } from "./tokenizer/transformer";
import { pipe } from "./util";
export const parseIni = <T extends string>(ini: T): Rwini => {
  const tokens = pipe(
    presetTokenizer(ini), 
    ...presetTransformers
  );
  const rIni = filterEmpty(
    flattenNode(
      "codeList", 
      flattenNode(
        "rwini", 
        [rwini(tokens)[0]],
      ),
    ),
  );
  return parseTree(rIni[0]);
};