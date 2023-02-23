"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInteger = exports.runWhiteSpace = exports.runFiniteStateMachine = void 0;
const runFiniteStateMachine = (inputs, stateMachine, inputEndState) => {
    const { transition, startState, endStates } = stateMachine;
    const run = (inputs, state) => {
        if (inputs.length == 0) {
            if (inputEndState) {
                return [inputEndState, inputs, []];
            }
            else {
                throw new Error("unexpected ending");
            }
        }
        else {
            const [newState, newOutput] = transition(state, inputs[0]);
            if (endStates.some(x => x == newState)) {
                return [newState, inputs, []];
            }
            else {
                const [finalState, finalInputs, finalOutputs] = run(inputs.slice(endStates.some(x => x == newState) ? 0 : 1), newState);
                return [finalState, finalInputs, [newOutput, ...finalOutputs]];
            }
        }
    };
    return run(inputs, startState);
};
exports.runFiniteStateMachine = runFiniteStateMachine;
const runWhiteSpace = (inputs) => {
    return (0, exports.runFiniteStateMachine)(inputs, {
        transition: (state, input) => {
            switch (state) {
                case "blank":
                    return [input.match(/^\s+$/) ? "blank" : "notblank", input];
                case "notblank":
                    return ["notblank", input];
            }
        },
        startState: "blank",
        endStates: ["notblank"],
    }, "notblank");
};
exports.runWhiteSpace = runWhiteSpace;
const runInteger = (inputs) => {
    return (0, exports.runFiniteStateMachine)(inputs, {
        transition: (state, input) => {
            switch (state) {
                case "number":
                    return [input.match(/^\d$/) ? "number" : "nan", input];
                case "nan":
                    return ["nan", input];
            }
        },
        startState: "number",
        endStates: ["nan"],
    }, "nan");
};
exports.runInteger = runInteger;
