import type { Position } from "../util";
import * as util from "../util";

export const SECTION_REG = /^(\s*)(\[)([^[\]]+?)(\])(\s*)(#.*)?$/;
export const CODE_REG = /^(\s*)([^:]+?)(:)(\s*)([^#]+)(#.*)?$/;
export const EMPTY_REG = /^(\s*)(#.*)?$/;
export const TEXT_REG = /^(.+)$/;

export type TokenType = 
  | "comment"
  | "bracketLeft"
  | "bracketRight"
  | "identifier"
  | "text"
  | "section"
  | "key"
  | "value"
  | "semicolon"
  | "keyValueSymbol"
  | "whiteSpace"
  | "newLine"
  | "tripleQuotes"


export interface Token {
  type: TokenType;
  value: string;
  range: {
    start: Position;
    end: Position;
  }
}

const sameLineRange = (line: number, start: number, length: number): {
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

export interface Tokenizer {
  (text: string): Token[];
}

export interface TokensTransformer {
  (tokens: Token[]): Token[];
}

export class TokenizeError extends Error {
  token: Token;
  constructor(msg: string, token: Token) {
    super(msg);
    this.name = "TokenizeError";
    this.token = token;
  }
}

export const presetTokenizer: Tokenizer = (text: string) => {
  const tokens: Token[] = [];
  const lines = text.split("\n");
  for(const [lineNum, line] of lines.entries()) {
    const counter = { 
      pos: 0, 
      step(length: number) {
        this.pos += length;
        return length;
      }
    };
    const genRange = (value: string) => {
      return sameLineRange(lineNum + 1, counter.pos + 1, counter.step(value.length));
    };
    const toToken = (type: TokenType) => (value: string | undefined) => value && value.length != 0 && tokens.push({
      type,
      value,
      range: genRange(value),
    });
    const toTokens = (...types: TokenType[]) => types.map(type => toToken(type));
    util.matches(line)([
      [
        EMPTY_REG,
        (res) => util.doForEach(
          res.slice(1),
          toTokens(
            "whiteSpace",
            "comment",
          ),
        )
      ],
      [
        SECTION_REG,
        (res) => util.doForEach(
          res.slice(1),
          toTokens(
            "whiteSpace",
            "bracketLeft",
            "identifier",
            "bracketRight",
            "whiteSpace",
            "comment"
          ),
        )
      ],
      [
        CODE_REG,
        (res) => util.doForEach(
          res.slice(1),
          toTokens(
            "whiteSpace",
            "identifier",
            "keyValueSymbol",
            "whiteSpace",
            "value",
            "comment",
          ),
        )
      ],
      [
        TEXT_REG,
        (res) => util.doForEach(
          res.slice(1),
          toTokens(
            "text",
          ),
        )
      ],
    ]);
    tokens.push({
      type: "newLine",
      value: "\n",
      range: {
        start: {
          line: lineNum,
          column: counter.pos + 1
        },
        end: {
          line: lineNum,
          column: counter.pos + 1
        },
      }
    });
  }
  return tokens;
};