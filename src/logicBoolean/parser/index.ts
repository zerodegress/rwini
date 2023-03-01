import { Token, TokenType } from "../tokenizer";

export type NodeType = 
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "greaterThanEquals"
  | "lessThan"
  | "lessThanEquals"
  | "add"
  | "sub"
  | "multiply"
  | "divide"
  | "mod"
  | "empty"
  | "number"
  | "identifier"
  | "member"
  | "null"
  | "call"
  | "index"
  | "bool"
  | "sequence"
  | "stringLiteral"
  | "namedPara"
  | "paraList"
  | "or"
  | "and"
  | "not"
  | "parren"
  | "member"
  | "expr"
  | "assign"
  | "addAssign"
  | "subAssign"
  | "multiplyAssign"
  | "divideAssign"
  | "modAssign"
  | "nullCallParas"

export interface Node {
  type: NodeType;
  value?: string;
  children: Node[];
  range: [number, number];
}

export class ParseError extends Error {
  token? :Token;
  constructor(msg: string, token?: Token) {
    super(msg);
    this.token = token;
  }
}

export type OpType = 
  | "notop"
  | "pre"
  | "sep"
  | "call"

export class Parser {
  ptr: number;
  tree: Node;
  stack: [OpType, Node][];
  pairing: Node[];
  input: Token[];
  nowNode: Node;
  recall: boolean;

  constructor(input: Token[], ptr = 0, recall = false) {
    this.input = input;
    this.ptr = ptr;
    this.tree = {
      type: "expr",
      children: [],
      range: [0, 0]
    };
    this.nowNode = this.tree;
    this.stack = [];
    this.recall = recall;
    this.pairing = [];
  }

  getCurrent(): Token {
    return this.input[this.ptr] || {
      type: "empty",
      range: [0,0]
    };
  }

  ahead() {
    this.ptr ++;
  }

  op() {
    const top = this.stack.at(-1);
    if(!top) {
      throw new ParseError(`unexpected empty. ptr:${this.ptr} recall:${this.recall}`, this.input[0]);
    }
    switch(top[0]) {
      case "sep":
        {
          const first = this.stack.pop();
          const second = this.stack.pop();
          if(!first || !second) {
            throw new ParseError("unexpected empty", this.input[0]);
          }
          first[1].children.push(second[1]);
          this.pairing.push(first[1]);
        }
        break;
      case "pre":
        {
          const first = this.stack.pop();
          if(!first) {
            throw new ParseError("unexpected empty", this.input[0]);
          }
          this.pairing.push(first[1]);
        }
        break;
    }
  }

  notop() {
    const top = this.stack.at(-1);
    if(!top) {
      throw new ParseError(`unexpected empty. ptr:${this.ptr} recall:${this.recall}`, this.input[0]);
    }
    switch(top[0]) {
      case "notop":
        {
          const pairing = this.pairing.pop();
          console.log(pairing);
          if(pairing) {
            const first = this.stack.pop();
            if(!first) {
              throw new ParseError("unexpected empty", this.input[0]);
            }
            pairing.children.push(first[1]);
            this.stack.push(["notop", pairing]);
          }
        }
        break;
    }
  }

  match(type: TokenType, toType: NodeType, opType: OpType = "notop") {
    if(toType == "empty") {
      this.ahead();
      return;
    }
    if(this.getCurrent().type == type) {
      this.stack.push([
        opType,
        {
          type: toType,
          value: this.input[this.ptr].value,
          children: [],
          range: this.input[this.ptr].range,
        }
      ]);
      this.op();
      this.ahead();
      return;
    }
    throw new ParseError(`expected type ${type}, found ${this.input[this.ptr].type}`, this.input[this.ptr]);
  }

  number() {
    this.match("number", "number");
  }

  bool() {
    this.match("bool", "bool");
  }

  nul() {
    this.match("null", "null");
  }

  identifier() {
    this.match("identifier", "identifier");
  }

  factor() {
    switch(this.getCurrent().type) {
      case "parrenLeft":
        this.match("parrenLeft", "empty");
        {
          const parser = new Parser(this.input, this.ptr, true);
          const [ptr, node] = parser.parse();
          this.ptr = ptr;
          this.stack.push(["notop", node]);
          this.notop();
        }
        this.match("parrenRight", "empty");
        break;
      case "number":
        this.number();
        break;
      case "bool":
        this.bool();
        break;
      case "null":
        this.nul();
        break;
      case "identifier":
        this.identifier();
        break;
      case "empty":
        this.op();
        break;
    }
  }

  callRest() {
    switch(this.getCurrent().type) {
      case "parrenLeft":
        this.match("parrenLeft", "empty");
        {
          const parser = new Parser(this.input, this.ptr, true);
          const [ptr, node] = parser.parse();
          this.ptr = ptr;
          const first = this.stack.pop();
          if(!first) {
            throw new ParseError("unexpected empty", this.input[0]);
          }
          this.stack.push(["notop", {
            type: "call",
            children: [
              first[1],
              node
            ],
            range: first[1].range
          }]);
        }
        this.notop();
        this.match("parrenRight", "empty");
        break;
      case "bracketLeft":
        this.match("bracketLeft", "empty");
        {
          const parser = new Parser(this.input, this.ptr, true);
          const [ptr, node] = parser.parse();
          this.ptr = ptr;
          const first = this.stack.pop();
          if(!first) {
            throw new ParseError("unexpected empty", this.input[0]);
          }
          this.stack.push(["notop", {
            type: "index",
            children: [
              first[1],
              node
            ],
            range: first[1].range
          }]);
        }
        this.notop();
        this.match("bracketRight", "empty");
        break;
      case "dot":
        this.match("dot", "member", "sep");
        this.factor();
        this.notop();
        break;
      default:
        return;
    }
    this.callRest();
  }

  call() {
    this.factor();
    this.callRest();
  }

  not() {
    switch(this.getCurrent().type) {
      case "not":
        this.match("not", "not", "pre");
        this.call();
        this.notop();
        break;
      default:
        this.call();
    }
  }

  mulRest() {
    switch(this.getCurrent().type) {
      case "multiply":
        this.match("multiply", "multiply", "sep");
        break;
      case "divide":
        this.match("divide", "divide", "sep");
        break;
      case "mod":
        this.match("mod", "mod", "sep");
        break;
      default:
        return;
    }
    this.not();
    this.notop();
    this.mulRest();
  }

  mul() {
    this.not();
    this.mulRest();
  }

  addRest() {
    switch(this.getCurrent().type) {
      case "plus":
        this.match("plus", "add", "sep");
        break;
      case "minus":
        this.match("minus", "sub", "sep");
        break;
      default:
        return;
    }
    this.mul();
    this.notop();
    this.addRest();
  }

  add() {
    this.mul();
    this.addRest();
  }

  noeqRest() {
    switch(this.getCurrent().type) {
      case "greaterThan":
        this.match("greaterThan", "greaterThan", "sep");
        break;
      case "lessThan":
        this.match("lessThan", "lessThan", "sep");
        break;
      case "greaterThanEquals":
        this.match("greaterThanEquals", "greaterThanEquals", "sep");
        break;
      case "lessThanEquals":
        this.match("lessThanEquals", "lessThanEquals", "sep");
        break;
      default:
        return;
    }
    this.add();
    this.notop();
    this.noeqRest();
  }

  noeq() {
    this.add();
    this.noeqRest();
  }

  eqRest() {
    switch(this.getCurrent().type) {
      case "equals":
        this.match("equals", "equals", "sep");
        break;
      case "notEquals":
        this.match("notEquals", "notEquals", "sep");
        break;
      default:
        return;
    }
    this.noeq();
    this.notop();
    this.noeqRest();
  }

  eq() {
    this.noeq();
    this.eqRest();
  }

  andRest() {
    switch(this.getCurrent().type) {
      case "and":
        this.match("and", "and", "sep");
        break;
      default:
        return;
    }
    this.eq();
    this.notop();
    this.andRest();
  }

  and() {
    this.eq();
    this.andRest();
  }

  orRest() {
    switch(this.getCurrent().type) {
      case "or":
        this.match("or", "or", "sep");
        break;
      default:
        return;
    }
    this.and();
    this.notop();
    this.orRest();
  }

  or() {
    this.and();
    this.orRest();
  }

  assignRest() {
    switch(this.getCurrent().type) {
      case "assign":
        this.match("assign", "assign", "sep");
        break;
      case "addAssign":
        this.match("addAssign", "addAssign", "sep");
        break;
      case "subAssign":
        this.match("subAssign", "subAssign", "sep");
        break;
      case "multiplyAssign":
        this.match("multiplyAssign", "multiplyAssign", "sep");
        break;
      case "divideAssign":
        this.match("divideAssign", "divideAssign", "sep");
        break;
      case "modAssign":
        this.match("modAssign", "modAssign", "sep");
        break;
      default:
        return;
    }
    this.or();
    this.notop();
    this.assignRest();
  }

  assign() {
    this.or();
    this.assignRest();
  }

  listRest() {
    switch(this.getCurrent().type) {
      case "comma":
        this.match("comma", "paraList", "sep");
        break;
      default:
        return;
    }
    this.assign();
    this.notop();
    this.listRest();
  }

  list() {
    this.assign();
    this.listRest();
  }

  parse(): [number, Node] {
    this.list();
    const latest = this.stack.pop();
    if(latest) {
      this.nowNode.children.push(latest[1]);
    }
    return [this.ptr, this.tree];
  }
}