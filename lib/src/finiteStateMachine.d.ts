export interface FiniteTransition<State, Input, Output> {
    (state: State, input: Input): [State, Output];
}
export interface FiniteStateMachine<State, Input, Output> {
    readonly transition: FiniteTransition<State, Input, Output>;
    readonly startState: State;
    readonly endStates: State[];
}
export type DeterministicFiniteTransition<State, Input, Output> = [State, Input, Output][];
export interface DeterministicFiniteStateMachine<State, Input, Output> {
    readonly transition: DeterministicFiniteTransition<State, Input, Output>;
    readonly startState: State;
    readonly endStates: State[];
}
export type StateOf<T> = T extends FiniteStateMachine<infer State, unknown, unknown> ? State : never;
export type InputOf<T> = T extends FiniteStateMachine<unknown, infer Input, unknown> ? Input : never;
export type OutputOf<T> = T extends FiniteStateMachine<unknown, unknown, infer Output> ? Output : never;
export interface FiniteStateMachineRunner<State, Input, Output> {
    (stateMachine: FiniteStateMachine<State, Input, Output>, inputs: Input[]): [State, Input[], Output[]];
}
export declare const runFiniteStateMachine: <State, Input, Output>(inputs: Input[], stateMachine: FiniteStateMachine<State, Input, Output>, inputEndState?: State | undefined) => [State, Input[], Output[]];
export interface CompeletlyFiniteStateMachineRunner<State, Input, Output> {
    (stateMachine: FiniteStateMachine<State, Input, Output>, inputs: Input[]): [State, Output[]][];
}
export declare const runWhiteSpace: (inputs: string[]) => ["blank" | "notblank", string[], string[]];
export declare const runInteger: (inputs: string[]) => ["number" | "nan", string[], string[]];
//# sourceMappingURL=finiteStateMachine.d.ts.map