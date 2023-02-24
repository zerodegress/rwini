import { Token, TokenizeError, TokensTransformer } from ".";
import * as _ from "lodash";

export const splitTripleQuotes:TokensTransformer = (tokens) => {
  const nTokens: Token[] = [];
  for(const token of tokens) {
    if(token.type != "value" && token.type != "text") {
      nTokens.push(token);
    } else {
      const pos = token.value.search(/"""/);
      if(pos != -1) {
        const [before, after] = token.value.split(/"""/);
        const newLines = before.split("\n").length - 1;
        if(before.length > 0) {
          nTokens.push({
            type: token.type,
            value: before,
            range: {
              start: token.range.start,
              end: {
                line: token.range.start.line + newLines,
                column: token.range.start.column + before.length - 1,
              },
            }
          });
        }
        nTokens.push({
          type: "tripleQuotes",
          value: "\"\"\"",
          range: {
            start: {
              line: token.range.start.line + newLines,
              column: token.range.start.column + before.length,
            },
            end: {
              line: token.range.start.line + newLines,
              column: token.range.start.column + before.length + 2,
            }
          }
        });
        if(after.length > 0) {
          nTokens.push({
            type: token.type,
            value: after,
            range: {
              start: {
                line: token.range.start.line + newLines,
                column: token.range.start.column + before.length + 3,
              },
              end: token.range.end,
            }
          });
        }
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
    tokensCache: [] as Token[]
  };
  for(const token of tokens) {
    if(states.tokensCache.length > 0) {
      states.tokensCache.push(token);
      if(token.type == "tripleQuotes") {
        nTokens.push({
          type: "value",
          value: states.tokensCache.map(x => x.value).join(""),
          range: {
            start: states.tokensCache[0].range.start,
            end: (_.last(states.tokensCache) as Token).range.end,
          },
        });
        states.tokensCache = [];
      }
    } else if(token.type == "tripleQuotes") {
      states.tokensCache.push(token);
    } else {
      nTokens.push(token);
    }
  }
  if(states.tokensCache.length > 0) {
    throw new TokenizeError("triple quotes should ends here", _.last(states.tokensCache) as Token);
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
            end: (_.last(states.tokensCache) as Token).range.end,
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