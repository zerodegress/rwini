"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.presetScanners = exports.unitMemoriesScanner = exports.copyFromScanner = exports.copyFromSectionScanner = exports.memoryScanner = exports.replaceScanner = void 0;
const replaceScanner = ([key, value], lastId, thisScope) => {
    const table = {};
    const define = key.match(/^((@define\s+(?<define>.+))|(@global\s+(?<global>.+)))$/)?.groups;
    let id = lastId;
    if (define) {
        if (define.define) {
            table.defines = [{
                    id: id++,
                    type: "replace",
                    content: value,
                    name: define.define,
                    scope: thisScope?.id || -1,
                }];
        }
        else if (define.global) {
            table.defines = [{
                    id: id++,
                    type: "replace",
                    content: value,
                    name: define.global,
                    scope: 0,
                }];
        }
    }
    return [table, id];
};
exports.replaceScanner = replaceScanner;
const memoryScanner = ([key, value], lastId, thisScope) => {
    const table = {};
    const define = key.match(/^@memory\s+(.+)$/)?.[1];
    let id = lastId;
    if (define) {
        table.defines = [{
                id: id++,
                type: "memory",
                content: value,
                name: define,
                scope: thisScope?.id || -1,
            }];
    }
    return [table, id];
};
exports.memoryScanner = memoryScanner;
const copyFromSectionScanner = ([key, value], lastId, thisScope) => {
    const table = {
        uses: [],
    };
    let id = lastId;
    if (key == "@copyFromSection") {
        value.split(",").forEach(sec => {
            table.uses.push({
                id: id++,
                type: "section",
                content: "",
                name: sec,
                scope: thisScope?.id || -1,
            });
        });
    }
    return [table, id];
};
exports.copyFromSectionScanner = copyFromSectionScanner;
const copyFromScanner = ([key, value], lastId, thisScope) => {
    const table = {
        uses: [],
    };
    let id = lastId;
    if (key == "copyFrom") {
        value.split(",").forEach(file => {
            table.uses.push({
                id: id++,
                type: "file",
                content: "",
                name: file,
                scope: thisScope?.id || -1,
            });
        });
    }
    return [table, id];
};
exports.copyFromScanner = copyFromScanner;
const unitMemoriesScanner = ([key, value], lastId, thisScope) => {
    const table = {
        defines: [],
    };
    let id = lastId;
    if (key == "defineUnitMemory") {
        value.split(",").forEach(memory => {
            const [type, name] = memory.trim().split(/\s+/);
            table.defines.push({
                id: id++,
                type: "memory",
                name: name,
                content: type,
                scope: thisScope?.id || -1
            });
        });
    }
    return [table, id];
};
exports.unitMemoriesScanner = unitMemoriesScanner;
exports.presetScanners = [
    exports.replaceScanner,
    exports.memoryScanner,
    exports.unitMemoriesScanner,
    exports.copyFromSectionScanner,
    exports.copyFromScanner,
];
const scan = (raw, scanners = exports.presetScanners, filename = "unnamed.ini") => {
    const table = {
        defines: [],
        uses: [],
        scopes: [],
    };
    const scopeStack = [{
            id: 0,
            type: "file",
            name: filename,
            scope: -1,
            content: {
                defines: [],
                uses: [],
                scopes: [],
            },
        }];
    let id = 1;
    for (const [name, section] of raw) {
        table.defines.push({
            id: id++,
            type: "section",
            name: name,
            scope: 0,
            content: "",
        });
        const secScope = {
            id: id++,
            type: "section",
            name: name,
            scope: 0,
            content: {
                defines: [],
                uses: [],
                scopes: [],
            },
        };
        table.scopes.push(secScope);
        scopeStack.push(secScope);
        for (const [key, value] of section) {
            for (const scanner of scanners) {
                const tab = scanner([key, value], id, table.scopes.at(-1));
                tab[0].defines && (() => {
                    tab[0].defines.forEach(define => {
                        table.defines.push(define);
                        table.scopes.find(scope => scope.id == define.scope)?.content.defines.push(define);
                    });
                })();
                tab[0].scopes && (() => {
                    tab[0].scopes.forEach(scope => {
                        table.scopes.push(scope);
                        table.scopes.find(scope => scope.id == scope.scope)?.content.scopes.push(scope);
                    });
                })();
                tab[0].uses && (() => {
                    tab[0].uses.forEach(use => {
                        table.uses.push(use);
                        table.scopes.find(scope => scope.id == use.scope)?.content.uses.push(use);
                    });
                })();
                id = tab[1];
            }
        }
        scopeStack.pop();
    }
    return table;
};
exports.scan = scan;
