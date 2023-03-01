import { Token, Tokenizer, TokenType } from ".";

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

export const templateLeft = term("${", "templateLeft");
export const templateRight = term("}", "templateRight");
export const templateBody = regex(/^[^}]*/, "templateBody");
export const templateOutside = regex(/^((?!\$\{).)*/, "templateOutside");

export const tokenize = (text: string, basePosition = 1, isInTemplate = false): Token[] => {
  if(text.length == 0) {
    return [];
  }
  if(!isInTemplate) {
    const [result, rest] = templateOutside(text, basePosition);
    if(!result) {
      throw new Error("unreachable!");
    }
    if(rest.length == 0) {
      return [result];
    } else {
      const [nResult, nRest] = templateLeft(rest, result.range[1] + 1);
      if(!nResult) {
        throw new Error("unreachable!");
      }
      return [result, nResult, ...tokenize(nRest, nResult.range[1] + 1, !isInTemplate)];
    }
  } else {
    const [result, rest] = templateBody(text, basePosition);
    if(!result) {
      throw new Error("unreachable!");
    }
    if(rest.length == 0) {
      throw new Error("unexpected template ending!");
    } else {
      const [nResult, nRest] = templateRight(rest, result.range[1] + 1);
      if(!nResult) {
        throw new Error("unreachable!");
      }
      return [result, nResult, ...tokenize(nRest, nResult.range[1] + 1, !isInTemplate)];
    }
  }
};