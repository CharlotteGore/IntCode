import React from "react";

import { OPCODE, PARAM, MODE } from "./intcode-runner";
import { DebugStateUpdate } from "./intcode-debugger";

const CurrentOp = (props: { machine: DebugStateUpdate }) => {
  const { machine } = props;
  if (machine !== null) {
    const { pc, op, rb, modes, program } = machine;

    const getParam = (param: PARAM, pc: number) => {
      let type = "";
      if (modes[param] === MODE.POSITION) {
        return `$${program[pc + param]} (${program[program[pc + param]] || 0})`;
      } else if (modes[param] === MODE.RELATIVE) {
        return `*${program[pc + param]} ($${rb + program[pc + param]} ${program[
          rb + program[pc + param]
        ] || 0})`;
      } else {
        return `${program[pc + param]}`;
      }
    };

    let rawStr: Array<number>;
    let assembled = OPCODE[op];
    switch (op) {
      case OPCODE.ADD:
      case OPCODE.MUL:
      case OPCODE.JLT:
      case OPCODE.JPE:
        rawStr = [
          program[pc],
          program[pc + 1],
          program[pc + 2],
          program[pc + 3]
        ];
        assembled = `${assembled} ${getParam(PARAM.ONE, pc)} ${getParam(
          PARAM.ONE,
          pc
        )} ${getParam(PARAM.THREE, pc)}`;
        break;
      case OPCODE.JPT:
      case OPCODE.JPF:
        rawStr = [program[pc], program[pc + 1], program[pc + 2]];
        assembled = `${assembled} ${getParam(PARAM.ONE, pc)} ${getParam(
          PARAM.ONE,
          pc
        )}`;
        break;
      case OPCODE.WRI:
      case OPCODE.REA:
      case OPCODE.SFT:
        rawStr = [program[pc], program[pc + 1]];
        assembled = `${assembled} ${getParam(PARAM.ONE, pc)}`;
        break;
      case OPCODE.NOP:
        rawStr = [];
        assembled = `-`;
        break;
      default:
        rawStr = [program[pc]];
    }

    return (
      <div className="CurrentOp">
        <span className="current-raw">{rawStr.join(",")}</span>{" "}
        <span className="assembly">{assembled}</span>
      </div>
    );
  }
  return null;
};

export default CurrentOp;
