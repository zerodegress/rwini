"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeRawToString = exports.parseTreetoRaw = void 0;
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
        text += `[${secname}]`;
        for (const [key, value] of sec) {
            text += `${key}:${value}\n`;
        }
    }
    return text;
};
exports.serializeRawToString = serializeRawToString;
