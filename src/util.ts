import * as _ from "lodash";

export interface Position {
  line: number;
  column: number;
}

export interface Range {
  start: Position,
  end: Position,
}

export const enumerate = <T>(arr: T[]) => {
  return Array.from(arr.entries());
};

export const match = (reg: RegExp, text: string) => {
  const result = reg.exec(text);
  return {
    then: (callback: (res: RegExpExecArray) => void) => result && callback(result),
  };
};

export const matches = (text: string) => (tuples: [RegExp, (res: RegExpExecArray) => void][]) => {
  for(const [reg, callback] of tuples) {
    const result = reg.exec(text);
    if(result) {
      callback(result);
      return;
    }
  }
};

export const doForEach = <T>(arr: T[], funcs: ((value: T) => void)[]) => {
  _.zip(arr, funcs).forEach(([item, func]) => {
    if(item && func) {
      func(item);
    }
  }); 
};

export const pipe = <T>(start: T, ...transformers: ((value: T) => T)[]) => {
  let state = start;
  for(const trans of transformers) {
    state = trans(state);
  }
  return state;
};