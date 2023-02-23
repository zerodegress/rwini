import { describe, it, expect } from "@jest/globals";

import { createMachine, stepMachine } from "../src/fsm";

describe("createMachine()", () => {
  it("creates Machine", () => {
    const [machine, state] = createMachine<string, string, string>({
      startState: "initial",
      endStates: ["end"],
      states: [
        {
          name: "initial",
          transitions: [
            {
              target: "end",
              condition: true,
              action: (input) => {
                return input;
              },
            }
          ]
        },
        {
          name: "end",
          ending: true,
          transitions: []
        }
      ]
    });
    expect(state).toBe("initial");
    expect(machine.startState).toBe("initial");
    expect(machine.endStates).toStrictEqual(["end"]);
    expect(machine.states.map(x => x.name)).toStrictEqual(["initial", "end"]);
  });
});

describe("stepMachine()", () => {
  it("runs number", () => {
    const [machine, state] = createMachine<string, string, number, string>({
      startState: "initial",
      endStates: ["end"],
      states: [
        {
          name: "initial",
          transitions: [
            {
              target: "number",
              condition: /^[0-9]$/,
              action: () => {
                return 1;
              }
            }
          ]
        },
        {
          name: "number",
          ending: "number",
          transitions: [
            {
              target: "number",
              condition: /^[0-9]$/,
              action: () => {
                return 1;
              },
            },
            {
              target: "end",
              condition: true,
              action: () => {
                return -1;
              }
            }
          ]
        },
        {
          name: "end",
          ending: "number",
          transitions: []
        }
      ]
    });
    expect(state).toBe("initial");
    const numberLexer = {
      chars: [..."12345123a"],
      state: state as string,
      range: [-1, 0] as [number, number],
      machine: machine,
    };
    while(numberLexer.range[1] < numberLexer.chars.length) {
      const [machine, state, {value, isEnd}] = stepMachine(
        [numberLexer.machine, numberLexer.state], numberLexer.chars[numberLexer.range[1]]
      );
      if(!isEnd) {
        if(numberLexer.range[0] == -1) {
          numberLexer.range[0] = 0;
        }
        numberLexer.range[1] += value as number;
        numberLexer.machine = machine;
        numberLexer.state = state;
      } else {
        break;
      }
    }
    const [start, end] = numberLexer.range;
    expect(numberLexer.chars.slice(start, end + 1).join("")).toBe("12345123");
  });
});