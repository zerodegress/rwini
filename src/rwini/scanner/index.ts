import * as _ from "lodash";
import { Node, visitTree } from "../parser";
import { isRawMemoryType, RawMemoryType } from "../value";

export interface Symbol {
  id: number;
  name: string;
}

export interface ScopedSymbol extends Symbol {
  scopeId: number;
}

export interface SectionSymbol extends Symbol {
  mainName: string;
  subName: string;
}

export type CodeSymbol = ScopedSymbol;

export interface DefineSymbol extends ScopedSymbol {
  value: string;
}

export interface MemorySymbol extends ScopedSymbol {
  type: RawMemoryType;
}

export interface ScopeSymbol extends Symbol {
  type: "mod" | "template" | "file" | "section" | "value";
}

export type UseType = 
  | "define"
  | "memory"

export interface UseSymbol extends ScopedSymbol {
  type: UseType;
  useName: string;
  useFrom: Node;
}

export interface SymbolTable {
  sections: SectionSymbol[];
  codes: CodeSymbol[];
  defines: DefineSymbol[];
  memories: MemorySymbol[];
  scopes: ScopeSymbol[];
  uses: UseSymbol[];
}

export const scanNode = (node: Node) => {
  const table: SymbolTable = {
    sections: [],
    codes: [],
    defines: [],
    memories: [],
    scopes: [],
    uses: [],
  };
  const states: {
    id: number;
    scopes: ScopeSymbol[];
  } = {
    id: 1,
    scopes: [{
      type: "file",
      name: "",
      id: 0,
    }],
  };
  table.scopes.push(states.scopes[0]);
  visitTree(node, (curr, chain) => {
    if(chain.length <= 0) {
      return;
    }
    switch(curr.type) {
      case "section":
        {
          table.sections.push({
            id: states.id++,
            name: curr.value,
            mainName: curr.value.split("_")[0],
            subName: curr.value.split("_").slice(1).join(""),
          });
          const scope: ScopeSymbol = {
            id: states.id++,
            name: curr.value,
            type: "section",
          };
          table.scopes.push(scope);
          if(_.last(states.scopes)?.type == "section") {
            states.scopes.pop();
          }
          states.scopes.push(scope);
        }
        break;
      case "code":
        {
          const [key, value] = [curr.children.find(x => x.type == "key"), curr.children.find(x => x.type == "value")];
          if(!key || !value) {
            break;
          }
          const res = /^(@define\s+(?<define>[^\s]+))|(@global\s+(?<global>[^\s]+))|(@memory\s+(?<memory>[^\s]+))$/.exec(key.value);
          if(res) {
            if(res.groups?.define) {
              table.defines.push({
                scopeId: _.last(states.scopes)?.id || -1,
                id: states.id++,
                name: res.groups.define,
                value: value.value,
              });
            } else if(res.groups?.global) {
              table.defines.push({
                scopeId: states.scopes[0].id,
                id: states.id++,
                name: res.groups.global,
                value: value.value,
              });
            } else if(res.groups?.memory) {
              if(!isRawMemoryType(value.value)) {
                throw new ScanError("the memory type is not valid", curr);
              }
              table.memories.push({
                scopeId: states.scopes[0].id,
                id: states.id++,
                name: res.groups.memory,
                type: value.value,
              });
            }
          } else if(key.value == "defineUnitMemory") {
            const memories = value.value
              .replace(/(""")|(''')|(\n)/g, "")
              .split(",")
              .filter(x => x && x != ",");
            for(const memory of memories) {
              const res = /^\s*(?<type>[^\s]+)\s+(?<name>[^\s]+)\s*$/.exec(memory);
              if(res && res.groups && res.groups.type && isRawMemoryType(res.groups.type) && res.groups.name) {
                table.memories.push({
                  scopeId: states.scopes[0].id,
                  id: states.id++,
                  name: res.groups.name,
                  type: res.groups.type,
                });
              } else {
                throw new ScanError("the memory define is not correct", curr);
              }
            }
          }
        }
        break;
    }
  });
  return table;
};

export class ScanError extends Error {
  node: Node;
  constructor(msg: string, node: Node) {
    super(msg);
    this.node = node;
  }
}