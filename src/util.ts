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

export const sameLineRange = (line: number, start: number, length: number): {
  start: Position;
  end: Position;
} => {
  return {
    start: {
      line,
      column: start,
    },
    end: {
      line,
      column: start + length - 1,
    }
  };
};

export interface Result<T, E = Error> {
  isOk: () => boolean;
  isErr: () => boolean;
  ifOk: (callback: (value: T) => void) => void;
  ifErr: (callback: (error: E) => void) => void;
  unwrap: () => T;
}

export const ok = <T, E = Error>(value: T): Result<T, E> => {
  return {
    isOk: () => true,
    isErr: () => false,
    ifOk: (callback) => {
      callback(value);
    },
    ifErr: () => null,
    unwrap: () => value,
  };
};

export const err = <T, E = Error>(error: E): Result<T, E> => {
  return {
    isOk: () => false,
    isErr: () => true,
    ifOk: () => null,
    ifErr: (callback) => {
      callback(error);
    },
    unwrap: () => {
      throw error;
    },
  };
};

export const asErr = <T1, T2, E = Error>(err: Result<T1, E>): Result<T2, E> => {
  return {
    isOk: () => false,
    isErr: () => true,
    ifOk: () => null,
    ifErr: (callback) => {
      err.ifErr(error => callback(error));
    },
    unwrap: () => {
      throw err.unwrap();
    }
  };
};

export type If<Type, Extends, Then, Or> = Type extends Extends ? Then : Or;
export type Only<Type, Extends, Then> = If<Type, Extends, Then, never>;