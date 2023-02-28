import { describe, it, expect } from "@jest/globals";
import { tokenize } from "../../src/logicBoolean/tokenizer";

describe("tokenize()", () => {
  it("tokenizes single expression", () => {
    expect(tokenize("true")).toStrictEqual([{type:"bool",value:"true",range:[1,4]}]);
    expect(tokenize("false")).toStrictEqual([{type:"bool",value:"false",range:[1,5]}]);
    expect(tokenize("  ")).toStrictEqual([{type:"whiteSpace",value:"  ",range:[1,2]}]);
    expect(tokenize("123.5")).toStrictEqual([{type:"number",value:"123.5",range:[1,5]}]);
    expect(tokenize("if")).toStrictEqual([{type:"if",range:[1,2]}]);
  });
  it("tokenizes complex expression", () => {
    expect(tokenize(" if")).toStrictEqual([{type:"whiteSpace",value:" ",range:[1,1]}, {type:"if",range:[2,3]}]);
    expect(tokenize("if abc()")).toStrictEqual([
      {type:"if",range:[1,2]},
      {type:"whiteSpace",value:" ",range:[3,3]},
      {type:"identifier",value:"abc",range:[4,6]},
      {type:"parrenLeft",range:[7,7]},
      {type:"parrenRight",range:[8,8]},
    ]);
    expect(tokenize("4 * a + (b - (c / 6))").filter(x => x.type != "whiteSpace")).toStrictEqual([
      {type:"number",value:"4",range:[1,1]},
      {type:"multiply",range:[3,3]},
      {type:"identifier",value:"a",range:[5,5]},
      {type:"plus",range:[7,7]},
      {type:"parrenLeft",range:[9,9]},
      {type:"identifier",value:"b",range:[10,10]},
      {type:"minus",range:[12,12]},
      {type:"parrenLeft",range:[14,14]},
      {type:"identifier",value:"c",range:[15,15]},
      {type:"divide",range:[17,17]},
      {type:"number",value:"6",range:[19,19]},
      {type:"parrenRight",range:[20,20]},
      {type:"parrenRight",range:[21,21]},
    ]);
  });
});