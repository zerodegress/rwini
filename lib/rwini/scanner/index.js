"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanError = exports.scanNode = void 0;
const _ = require("lodash");
const parser_1 = require("../parser");
const value_1 = require("../../value");
const scanNode = (node) => {
    const table = {
        sections: [],
        codes: [],
        defines: [],
        memories: [],
        scopes: [],
    };
    const states = {
        id: 1,
        scopes: [{
                type: "file",
                name: "",
                id: 0,
            }],
    };
    table.scopes.push(states.scopes[0]);
    (0, parser_1.visitTree)(node, (curr, chain) => {
        if (chain.length <= 0) {
            return;
        }
        switch (curr.type) {
            case "section":
                {
                    table.sections.push({
                        id: states.id++,
                        rawName: curr.value,
                        mainName: curr.value.split("_")[0],
                        subName: curr.value.split("_").slice(1).join(""),
                    });
                    const scope = {
                        id: states.id++,
                        name: curr.value,
                        type: "section",
                    };
                    table.scopes.push(scope);
                    if (_.last(states.scopes)?.type == "section") {
                        states.scopes.pop();
                    }
                    states.scopes.push(scope);
                }
                break;
            case "code":
                {
                    const [key, value] = [curr.children.find(x => x.type == "key"), curr.children.find(x => x.type == "value")];
                    if (!key || !value) {
                        break;
                    }
                    const res = /^(@define\s+(?<define>.+))|(@global\s+(?<global>.+))|(@memory\s+(?<memory>.+))$/.exec(key.value);
                    if (res) {
                        if (res.groups?.define) {
                            table.defines.push({
                                scopeId: _.last(states.scopes)?.id || -1,
                                id: states.id++,
                                name: res.groups.define,
                                value: value.value,
                            });
                        }
                        else if (res.groups?.global) {
                            table.defines.push({
                                scopeId: states.scopes[0].id,
                                id: states.id++,
                                name: res.groups.global,
                                value: value.value,
                            });
                        }
                        else if (res.groups?.memory) {
                            if (!(0, value_1.isRawMemoryType)(value.value)) {
                                throw new ScanError("the memory type is not valid", curr);
                            }
                            table.memories.push({
                                scopeId: states.scopes[0].id,
                                id: states.id++,
                                name: res.groups.memory,
                                type: value.value,
                            });
                        }
                    }
                    else if (key.value == "defineUnitMemory") {
                        const memories = value.value
                            .replace(/(""")|(''')|(\n)/g, "")
                            .split(",")
                            .filter(x => x && x != ",");
                        for (const memory of memories) {
                            const res = /^\s*(?<type>)\s+(?<name>)\s*$/.exec(memory);
                            if (res && res.groups && res.groups.type && (0, value_1.isRawMemoryType)(res.groups.type) && res.groups.name) {
                                table.memories.push({
                                    scopeId: states.scopes[0].id,
                                    id: states.id++,
                                    name: res.groups.name,
                                    type: res.groups.type,
                                });
                            }
                            else {
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
exports.scanNode = scanNode;
class ScanError extends Error {
    node;
    constructor(msg, node) {
        super(msg);
        this.node = node;
    }
}
exports.ScanError = ScanError;
