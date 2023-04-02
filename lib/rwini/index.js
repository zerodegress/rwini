"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeRawToString = exports.parseTreetoRaw = exports.combineRaw = void 0;
const combineRaw = (...raws) => {
    if (raws.length == 0) {
        return new Map();
    }
    else if (raws.length == 1) {
        return raws[0];
    }
    else {
        const nRaw = new Map();
        for (const raw of raws) {
            for (const [name, sec] of raw) {
                nRaw.set(name, new Map(sec.entries()));
            }
        }
        return nRaw;
    }
};
exports.combineRaw = combineRaw;
const parseTreetoRaw = (node) => {
    const ini = new Map();
    if (node.type == "rwini") {
        for (const sec of node.children) {
            if (sec.type != "section") {
                continue;
            }
            const codes = new Map();
            ini.set(sec.value, codes);
            for (const code of sec.children.filter(code => code.type == "code")) {
                codes.set(code.children.find(x => x.type == "key")?.value || "", code.children.find(x => x.type == "value")?.value || "");
            }
        }
    }
    return ini;
};
exports.parseTreetoRaw = parseTreetoRaw;
const serializeRawToString = (raw) => {
    let text = "";
    for (const [secname, sec] of raw) {
        text += `[${secname}]\n`;
        for (const [key, value] of sec) {
            text += `${key}:${value}\n`;
        }
    }
    return text;
};
exports.serializeRawToString = serializeRawToString;
