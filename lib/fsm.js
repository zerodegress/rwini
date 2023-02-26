"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepMachine = exports.createMachine = void 0;
const createMachine = (settings) => {
    return [
        settings,
        settings.states.find(state => state.name == settings.startState)?.name,
    ];
};
exports.createMachine = createMachine;
const stepMachine = (group, input) => {
    const [machine, state] = group;
    const st = machine.states.find(x => x.name == state);
    if (!st) {
        throw new Error(`the state "${state}" was not in machine.states`);
    }
    if (machine.endStates.includes(state)) {
        if (st.ending) {
            return [
                machine,
                state,
                {
                    value: st.ending,
                    isEnd: true,
                }
            ];
        }
        else {
            throw new Error(`the end state "${state}" has no ending`);
        }
    }
    else {
        const trans = st.transitions.find(trans => {
            if (typeof trans.condition == "boolean" && trans.condition) {
                return true;
            }
            if (typeof trans.condition == "function") {
                if (trans.condition(input)) {
                    return true;
                }
            }
            if (trans.condition instanceof RegExp) {
                if (trans.condition.test(input)) {
                    return true;
                }
            }
        });
        if (!trans) {
            if (st.ending) {
                return [
                    machine,
                    state,
                    {
                        value: st.ending,
                        isEnd: true,
                    }
                ];
            }
            else {
                throw new Error(`no transition accepts input: ${input}`);
            }
        }
        const [target, output] = [trans.target, trans.action(input)];
        const targetState = machine.states.find(state => state.name == target);
        if (!targetState) {
            throw new Error(`no state named: ${target}`);
        }
        return [
            trans.machine || machine,
            targetState.name,
            {
                value: output,
                isEnd: false,
            }
        ];
    }
};
exports.stepMachine = stepMachine;
