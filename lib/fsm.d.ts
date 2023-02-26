export interface State<Name, Input, Output, End = boolean> {
    name: Name;
    ending?: End;
    transitions: {
        target: Name;
        machine?: Machine<Name, Input, Output, End>;
        condition: boolean | ((input: Input) => boolean) | (Input extends string ? RegExp : never);
        action: ((input: Input) => Output);
    }[];
}
export interface Machine<StateName, Input, Output, End = boolean> {
    startState: StateName;
    states: State<StateName, Input, Output, End>[];
    endStates: StateName[];
}
export declare const createMachine: <StateName, Input, Output, End = boolean>(settings: Machine<StateName, Input, Output, End>) => [Machine<StateName, Input, Output, End>, StateName | undefined];
export declare const stepMachine: <StateName, Input, Output, End = boolean>(group: [Machine<StateName, Input, Output, End>, StateName], input: Input) => [Machine<StateName, Input, Output, End>, StateName, {
    value: Output | End;
    isEnd: boolean;
}];
//# sourceMappingURL=fsm.d.ts.map