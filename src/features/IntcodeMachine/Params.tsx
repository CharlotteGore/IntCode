import React from "react";

import { OPCODE, PARAM, MODE, ParameterModes } from "./intcode-runner";
import { DebugStateUpdate } from "./intcode-debugger";

const Param = (props: { machine: DebugStateUpdate; param: PARAM }) => {
  const { pc, modes, program, rb } = props.machine;
  const { param } = props;

  if (modes[param] === MODE.POSITION) {
    return (
      <li>
        P{param}: ${program[pc + param]} (
        <span>{program[rb + program[pc + param]] || 0}</span>)
      </li>
    );
  } else if (modes[param] === MODE.RELATIVE) {
    return (
      <li>
        P{param}: <span>*{program[pc + param]}</span> (
        <span>${rb + program[pc + param]}</span>{" "}
        {program[rb + program[pc + param]] || 0})
      </li>
    );
  } else {
    return (
      <li>
        <span>
          P{param}: {program[pc + param]}
        </span>
      </li>
    );
  }
};

const NullParam = (props: { param: PARAM }) => <li>P{props.param}: ---</li>;

const Params = (props: { machine: DebugStateUpdate }) => {
  const { machine } = props;
  if (machine !== null) {
    const { pc, op, rb, modes, program } = machine;

    let params = [];
    switch (op) {
      case OPCODE.ADD:
      case OPCODE.MUL:
      case OPCODE.JLT:
      case OPCODE.JPE:
        params.push(
          <Param key={0} machine={machine} param={PARAM.ONE}></Param>
        );
        params.push(
          <Param key={1} machine={machine} param={PARAM.TWO}></Param>
        );
        params.push(
          <Param key={2} machine={machine} param={PARAM.THREE}></Param>
        );
        break;
      case OPCODE.JPT:
      case OPCODE.JPF:
        params.push(
          <Param key={0} machine={machine} param={PARAM.ONE}></Param>
        );
        params.push(
          <Param key={1} machine={machine} param={PARAM.TWO}></Param>
        );
        params.push(<NullParam key={2} param={PARAM.THREE}></NullParam>);
        break;
      case OPCODE.WRI:
      case OPCODE.REA:
      case OPCODE.SFT:
        params.push(
          <Param key={0} machine={machine} param={PARAM.ONE}></Param>
        );
        params.push(<NullParam key={1} param={PARAM.TWO}></NullParam>);
        params.push(<NullParam key={2} param={PARAM.THREE}></NullParam>);
        break;
      default:
        params.push(<NullParam key={0} param={PARAM.ONE}></NullParam>);
        params.push(<NullParam key={1} param={PARAM.TWO}></NullParam>);
        params.push(<NullParam key={2} param={PARAM.THREE}></NullParam>);
    }

    return <ul className="Params">{[...params]}</ul>;
  }
  return null;
};

export default Params;
