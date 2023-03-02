import { Token, TokenizeError, TokensTransformer } from ".";
import { Position } from "../../util";

export const splitTripleQuotes:TokensTransformer = (tokens) => {
  const nTokens: Token[] = [];
  for(const token of tokens) {
    if(token.type != "value" && token.type != "text") {
      nTokens.push(token);
    } else {
      const res = Array.from(token.value.match(/(""")|(''')/g) || []);
      if(res.length > 0) {
        const splits = token.value.split(/(""")|(''')/g).filter(x => x);
        const suffixTokens: Token[] = [];
        const pos: Position = token.range.start;
        for(const split of splits) {
          const start = {...pos};
          const end = {
            line: pos.line, 
            column: pos.column + split.length - 1,
          };
          if(split.length > 0) {
            suffixTokens.push({
              type: split.match(/(""")|(''')/) ? "tripleQuotes" : "value",
              value: split,
              range: {
                start,
                end,
              }
            });
          }
          pos.line = end.line;
          pos.column = end.column + 1;
        }
        nTokens.push(...suffixTokens);
      } else {
        nTokens.push(token);
      }
    }
  }
  return nTokens;
};

export const concatMultilineValue: TokensTransformer = (tokens) => {
  const nTokens: Token[] = [];
  const states = {
    tokensCache: [] as Token[],
    almostEnd: false,
    may: false,
  };
  for(const token of tokens) {
    if(states.tokensCache.length > 0) {
      switch(token.type) {
        case "tripleQuotes":
          states.almostEnd = !states.almostEnd;
          states.may = false;
          states.tokensCache.push(token);
          break;
        case "newLine":
          if(states.almostEnd) {
            if(states.may) {
              nTokens.push(...states.tokensCache);
              nTokens.push(token);
              states.may = false;
              states.tokensCache = [];
              break;
            }
            nTokens.push({
              type: "value",
              value: states.tokensCache.map(x => x.value).join(""),
              range: {
                start: states.tokensCache[0].range.start,
                end: (states.tokensCache.at(-1) as Token).range.end,
              }
            });
            nTokens.push(token);
            states.tokensCache = [];
            states.almostEnd = false;
          } else {
            states.tokensCache.push(token);
          }
          break;
        default:
          states.tokensCache.push(token);
      }
    } else if(token.type == "tripleQuotes") {
      states.tokensCache.push(token);
      states.almostEnd = false;
    } else if(token.type == "value") {
      states.tokensCache.push(token);
      states.may = true;
      states.almostEnd = true;
    } else {
      nTokens.push(token);
    }
  }
  if(states.tokensCache.length > 0) {
    throw new TokenizeError("triple quotes should ends here", states.tokensCache.at(-1) as Token);
  }
  return nTokens;
};

export const concatSectionComment: TokensTransformer = (tokens) => {
  const nTokens: Token[] = [];
  const states = {
    tokensCache: [] as Token[]
  };
  for(const token of tokens) {
    if(states.tokensCache.length > 0) {
      if(token.type != "section") {
        states.tokensCache.push(token);
      } else {
        nTokens.push({
          type: "comment",
          value: states.tokensCache.map(x => x.value).join(""),
          range: {
            start: states.tokensCache[0].range.start,
            end: (states.tokensCache.at(-1) as Token).range.end,
          },
        });
        states.tokensCache = [];
        if(token.type == "section" && token.value.startsWith("comment")) {
          states.tokensCache.push(token);
        } else {
          nTokens.push(token);
        }
      }
    } else if(token.type == "section" && token.value.startsWith("comment")) {
      states.tokensCache.push(token);
    } else {
      nTokens.push(token);
    }
  }
  if(states.tokensCache.length > 0) {
    nTokens.push({
      type: "comment",
      value: states.tokensCache.map(x => x.value).join(""),
      range: {
        start: states.tokensCache[0].range.start,
        end: states.tokensCache[1].range.end,
      },
    });
  }
  return nTokens;
};

export const filterWhitespace: TokensTransformer = (tokens) => {
  return tokens.filter(token => !(token.type == "whiteSpace")); 
};

export const filterNewLine: TokensTransformer = (tokens) => {
  return tokens.filter(token => !(token.type == "newLine"));
};

export const filterKeyValueSymbol: TokensTransformer = (tokens) => {
  return tokens.filter(token => !(token.type == "keyValueSymbol"));
};

export const filterComments: TokensTransformer = (tokens) => {
  return tokens.filter(token => !(token.type == "comment"));
};

export const presetTransformers = [
  splitTripleQuotes,
  concatMultilineValue,
  concatSectionComment,
  filterWhitespace,
  filterNewLine,
  filterComments,
  filterKeyValueSymbol,
];