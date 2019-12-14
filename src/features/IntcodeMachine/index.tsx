import React, { useState, useEffect } from "react";
import "./intcode.css";
import Params from "./Params";
import CurrentOp from "./CurrentOp";
import ProgramDump from "./ProgramDump";
import { Machine, DebugMachine } from "./machine";
import { DebugStateUpdate } from "./intcode-debugger";
import { OPCODE, MODE, PARAM } from "./intcode-runner";

type DebugControls = {
  doStep: () => void;
};

const useMachine = (machine: DebugMachine) => {
  const [machineState, setMachineState] = useState<DebugStateUpdate>({
    program: machine.debug.program,
    pc: -1,
    rb: 0,
    op: OPCODE.NOP,
    id: machine.config.id,
    lastOutput: null,
    modes: {
      [PARAM.ONE]: MODE.POSITION,
      [PARAM.TWO]: MODE.POSITION,
      [PARAM.THREE]: MODE.POSITION
    }
  });
  const [debugControls, setDebugControls] = useState<DebugControls>({
    doStep: () => {}
  });
  useEffect(() => {
    if (machine) {
      const { debug } = machine;

      debug.onUpdate((update: DebugStateUpdate) => {
        setMachineState(update);
      });
      setDebugControls({
        doStep: debug.step.bind(debug) // is this bind necessary? // yep
      });
      return () => {
        debug.onFire = true;
      };
    }
  }, [machine]);

  return {
    machineState,
    debugControls
  };
};

const IntcodeMachine = (props: { machine: DebugMachine }) => {
  const [showDump, setShowDump] = useState<boolean>(false);
  const { id } = props.machine.config;
  const toggleShowDump = () => {
    setShowDump(!showDump);
  };

  const { debug } = props.machine;
  const { machineState, debugControls } = useMachine(props.machine);

  return (
    <div className={`IntcodeMachine ${debug.onFire ? "halted" : ""}`}>
      {id && (
        <>
          <h3>
            Machine ID: {id}{" "}
            <button onClick={toggleShowDump}>{showDump ? "V" : "T"}</button>
          </h3>
          <p>Base: {machineState.rb}</p>
          <Params machine={machineState} />
          <p>Outputs: {machineState.lastOutput}</p>
          <CurrentOp machine={machineState} />
          <button onClick={debugControls.doStep!}>></button>
          {showDump && <ProgramDump machine={machineState} />}
        </>
      )}
    </div>
  );
};

export default IntcodeMachine;
