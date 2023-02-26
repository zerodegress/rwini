"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRawMemoryType = void 0;
const isRawMemoryType = (type) => {
    if (["number", "string", "bool", "unit", "marker"].find(x => x == type)) {
        return true;
    }
    else {
        return false;
    }
};
exports.isRawMemoryType = isRawMemoryType;
