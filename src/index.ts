import { rwini, filterEmpty, flattenNode } from "./rwini/parser";
import { parseTreetoRaw, Raw } from "./rwini";
import { presetTokenizer } from "./rwini/tokenizer";
import { presetTransformers } from "./rwini/tokenizer/transformer";
import { pipe } from "./util";
export const parseIni = <T extends string>(ini: T): Raw => {
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
  return parseTreetoRaw(rIni[0]);
};