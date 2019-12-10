import Debugger from "./intcode-debugger";
import produce from "immer";

export enum MODE {
  POSITION = 0,
  IMMEDIATE = 1,
  RELATIVE = 2
}
export enum PARAM {
  ONE = 1,
  TWO = 2,
  THREE = 3
}
export enum OPCODE {
  NOP = 0,
  ADD = 1,
  MUL = 2,
  REA = 3,
  WRI = 4,
  JPT = 5,
  JPF = 6,
  JLT = 7,
  JPE = 8,
  SFT = 9,
  HCF = 99
}
export type ParameterModes = Record<PARAM, MODE>;
export type IntcodeProgram = Array<number>;
export type ProgramCounter = number;
export type RelativeBase = number;

export type IntcodeRunner = AsyncGenerator<number, null, boolean>;

async function* intcodeRunner(
  program: IntcodeProgram,
  inputGenerator: AsyncGenerator<number, null, boolean>,
  debug: Debugger | null,
  id: number
): IntcodeRunner {
  let pc: ProgramCounter = 0;
  let rb: RelativeBase = 0;
  let control;

  let modes: ParameterModes = {
    [PARAM.ONE]: MODE.POSITION,
    [PARAM.TWO]: MODE.POSITION,
    [PARAM.THREE]: MODE.POSITION
  };

  if (debug) {
    debug.program = program;
    debug.modes = modes;
    control = debug.control();
    debug.pc = pc;
    if (control) await control.next();
  }

  const getValue = (d: PARAM) => {
    let r;
    if (modes[d] === MODE.RELATIVE) {
      r = program[rb + program[pc + (d - 1)]];
    } else {
      r = modes[d] ? program[pc + (d - 1)] : program[program[pc + (d - 1)]];
    }
    if (!r) return 0;
    return r;
  };
  const getPointer = (d: PARAM) => {
    if (modes[d] === MODE.RELATIVE) {
      return rb + program[pc + (d - 1)];
    } else {
      return modes[d] ? pc + (d - 1) : program[pc + (d - 1)];
    }
  };

  while (true) {
    let inst = program[pc++];
    let op: OPCODE | null;

    let p3 = ~~(inst / 10000);
    op = inst - p3 * 10000;
    let p2 = ~~(op / 1000);
    op = op - p2 * 1000;
    let p1 = ~~(op / 100);
    op = op - p1 * 100;

    modes = produce(modes, draft => {
      draft[PARAM.ONE] = p1;
      draft[PARAM.TWO] = p2;
      draft[PARAM.THREE] = p3;
    });

    if (debug) {
      debug.pc = pc - 1;
      debug.op = op;
      debug.modes = modes;
      if (control) await control.next();
    }

    switch (op!) {
      case OPCODE.ADD: {
        let a = getValue(1);
        let b = getValue(2);
        program[getPointer(3)] = a + b;

        pc += 3;
        break;
      }
      case OPCODE.MUL: {
        let a = getValue(1);
        let b = getValue(2);
        program[getPointer(3)] = a * b;

        pc += 3;
        break;
      }
      case OPCODE.REA: {
        let i = await inputGenerator.next();
        if (i.done === true) {
          console.warn("Shutting down runner because there is no input");
          return null;
        }
        program[getPointer(1)] = i.value;
        pc += 1;
        break;
      }
      case OPCODE.WRI: {
        let r = getValue(1);

        pc++;
        console.log(id, "waiting to yield", r);
        await (yield r);
        console.log(id, "yielded");
        break;
      }
      case OPCODE.JPT: {
        if (getValue(1)) {
          pc = getValue(2);
        } else {
          pc += 2;
        }

        break;
      }
      case OPCODE.JPF: {
        if (!getValue(1)) {
          pc = getValue(2);
        } else {
          pc += 2;
        }
        break;
      }
      case OPCODE.JLT: {
        let c = getPointer(3);
        if (getValue(1) < getValue(2)) {
          program[c] = 1;
        } else {
          program[c] = 0;
        }

        pc += 3;
        break;
      }
      case OPCODE.JPE: {
        let c = getPointer(3);
        if (getValue(1) === getValue(2)) {
          program[c] = 1;
        } else {
          program[c] = 0;
        }
        pc += 3;
        break;
      }
      case OPCODE.SFT: {
        let c = getValue(1);
        rb += c;
        if (debug) debug.rb = rb;
        pc++;
        break;
      }
      case OPCODE.HCF: {
        if (debug) {
          debug.onFire = true;
        }
        return null;
      }
      default: {
        throw new Error(`Invalid Op Code ${op!}`);
      }
    }
  }
}

export default intcodeRunner;
