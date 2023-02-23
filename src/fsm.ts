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

export const createMachine = <StateName, Input, Output, End = boolean>(
  settings: Machine<StateName, Input, Output, End>,
): [
  Machine<StateName, Input, Output, End>, 
  StateName | undefined,
] => {
  return [
    settings,
    settings.states.find(state => state.name == settings.startState)?.name,
  ];
};

export const stepMachine = <StateName, Input, Output, End = boolean>(
  group: [
    Machine<StateName, Input, Output, End>,
    StateName,
  ], 
  input: Input
): [
  Machine<StateName, Input, Output, End>, 
  StateName,
  {
    value: Output | End;
    isEnd: boolean;
  },
] => {
  const [machine, state] = group;
  const st = machine.states.find(x => x.name == state);
  if(!st) {
    throw new Error(`the state "${state}" was not in machine.states`);
  }
  if(machine.endStates.includes(state)) {
    if(st.ending) {
      return [
        machine,
        state,
        {
          value: st.ending,
          isEnd: true,
        }
      ];
    } else {
      throw new Error(`the end state "${state}" has no ending`);
    }
  } else {
    const trans = st.transitions.find(trans => {
      if(typeof trans.condition == "boolean" && trans.condition) {
        return true;
      }
      if(typeof trans.condition == "function") {
        if(trans.condition(input)) {
          return true;
        }
      }
      if(trans.condition instanceof RegExp) {
        if(trans.condition.test(input as string)) {
          return true;
        }
      }
    });
    if(!trans) {
      if(st.ending) {
        return [
          machine,
          state,
          {
            value: st.ending,
            isEnd: true,
          }
        ];
      } else {
        throw new Error(`no transition accepts input: ${input}`);
      }
    }
    const [target, output] = [trans.target, trans.action(input)];
    const targetState = machine.states.find(state => state.name == target);
    if(!targetState) {
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