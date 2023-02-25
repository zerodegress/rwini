import { Node } from "./parser";

export type Rwini = Map<string, Map<string, string>>;

export const parseTree = (node: Node) => {
  const ini: Rwini = new Map();
  if(node.type == "rwini") {
    for(const sec of node.children) {
      if(sec.type != "section") {
        continue;
      }
      const codes = new Map<string, string>();
      ini.set(sec.value, codes);
      for(const code of sec.children.filter(code => code.type == "code")) {
        codes.set(
          code.children.find(x => x.type == "key")?.value || "",
          code.children.find(x => x.type == "value")?.value || "",
        );
      }
    }
  }
  return ini;
};