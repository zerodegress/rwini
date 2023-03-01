export type TokenType = 
  | "number"
  | "bool"
  | "stringLiteral"
  | "parrenLeft"
  | "parrenRight"
  | "bracketLeft"
  | "bracketRight"
  | "comma"
  | "equals"
  | "notEquals"
  | "lessThan"
  | "greaterThan"
  | "lessThanEquals"
  | "greaterThanEquals"
  | "plus"
  | "minus"
  | "multiply"
  | "divide"
  | "mod"
  | "if"
  | "and"
  | "or"
  | "not"
  | "whiteSpace"
  | "identifier"
  | "dot"
  | "null"
  | "empty"
  | "assign"
  | "addAssign"
  | "subAssign"
  | "multiplyAssign"
  | "divideAssign"
  | "modAssign"

export interface Token {
  type: TokenType;
  value?: string;
  range: [number, number];
}

export interface Tokenizer {
  (input: string, basePosition: number): [Token | undefined, string];
}

export const term = (text: string, type: TokenType): Tokenizer => (input: string, basePosition = 1) => {
  if(input.startsWith(text)) {
    return [{
      type,
      range: [basePosition, basePosition + text.length - 1]
    }, input.replace(text, "")];
  } else {
    return [undefined, input];
  }
};
export const regex = (reg: RegExp, type: TokenType): Tokenizer  => (input: string, basePosition = 1) => {
  const res = reg.exec(input);
  if(res) {
    return [{
      type,
      value: res[0],
      range: [basePosition, basePosition + res[0].length - 1]
    }, input.replace(reg, "")];
  } else {
    return [undefined, input];
  }
};
export const number = regex(/^(([1-9][0-9]+)|([0-9]))(\.[0-9]+f?)?/, "number");
export const stringLiteral = regex(/^(("((\\")|([^"]))*")|('((\\')|([^']))*'))/, "stringLiteral");
export const parrenLeft = term("(", "parrenLeft");
export const parrenRight = term(")", "parrenRight");
export const bracketLeft = term("[", "bracketLeft");
export const bracketRight = term("]", "bracketRight");
export const bool = regex(/^(true)|(false)/, "bool");
export const if_ = term("if", "if");
export const and = term("and", "and");
export const not = term("not", "not");
export const or = term("or", "or");
export const null_ = term("null", "null");
export const comma = term(",", "comma");
export const equals = term("==", "equals");
export const notEquals = term("!=", "notEquals");
export const greaterThan = term(">", "greaterThan");
export const lessThan = term("<", "lessThan");
export const greaterThanEquals = term(">=", "greaterThanEquals");
export const lessThanEquals = term("<=", "lessThanEquals");
export const plus = term("+", "plus");
export const minus = term("-", "minus");
export const multiply = term("*", "multiply");
export const divide = term("/", "divide");
export const mod = term("%", "mod");
export const dot = term(".", "dot");
export const identifier = regex(/^(([^\s=+\-*/()[\]\\/:;'",.!~@#$%^&*]+)|([^\s=+\-*/()[\]\\/:;'",.!~@#$%^&*0-9]))/, "identifier");
export const whiteSpace = regex(/^\s*/, "whiteSpace");
export const assign = term("=", "assign");
export const addAssign = term("+=", "addAssign");
export const subAssign = term("-=", "subAssign");
export const multiplyAssign = term("*=", "multiplyAssign");
export const divideAssign = term("/=", "divideAssign");
export const modAssign = term("%=", "modAssign");

export const tokenizers: Tokenizer[] = [
  number,
  stringLiteral,
  parrenLeft,
  parrenRight,
  bracketLeft,
  bracketRight,
  bool,
  if_,
  and,
  not,
  or,
  null_,
  comma,
  equals,
  notEquals,
  greaterThan,
  greaterThanEquals,
  lessThan,
  lessThanEquals,
  assign,
  addAssign,
  subAssign,
  multiplyAssign,
  divideAssign,
  modAssign,
  plus,
  minus,
  multiply,
  divide,
  mod,
  dot,
  identifier,
  whiteSpace,
];

export const tokenize = (text: string, basePosition = 1): Token[] => {
  if(text.length == 0) {
    return [];
  }
  const [result, rest] = (() => {
    for(const tokenizer of tokenizers) {
      const [result, rest] = tokenizer(text, basePosition);
      if(result) {
        return [result, rest];
      }
    }
    throw new Error("unreachable!");
  })();
  return [result, ...tokenize(rest, result.range[1] + 1)];
};