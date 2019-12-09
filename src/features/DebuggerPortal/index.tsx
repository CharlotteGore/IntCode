import React, { useState, useEffect } from "react";
import programs from "../IntcodeMachine/programs";
import IntcodeMachine from "../IntcodeMachine";
import "./debuggerportal.css";
import {
  createMachine,
  Machine,
  MachineConfig,
  UninitialisedMachineType
} from "../IntcodeMachine/machine";
import produce from "immer";

import UninitialisedMachine from "../IntcodeMachine/UnitiatialisedMachine";

let instanceId = 1;

const useMachineFactory = (machineConfig: Array<MachineConfig>) => {
  const [machines, setMachines] = useState<{
    pending: Array<UninitialisedMachineType>;
    running: Array<Machine>;
  }>({ pending: [], running: [] });

  const setMachineRunning = (machine: Machine) => {
    const id = machine.config.id;
    const pendingMachine = machines.pending.find(m => m.config.id === id);
    let newMachines;
    if (pendingMachine) {
      machines.pending.splice(machines.pending.indexOf(pendingMachine), 1);
    }
    machines.running.push(machine);
    setMachines({
      pending: machines.pending,
      running: machines.running
    });
  };

  useEffect(() => {
    const newMachines = machineConfig.reduce(
      (newMachines: Array<UninitialisedMachineType>, config) => {
        if (!machines.pending.find(m => m.config.id === config.id)) {
          newMachines.push(createMachine(config));
        }
        return newMachines;
      },
      []
    );
    if (newMachines.length) {
      setMachines({
        pending: machines.pending.concat(newMachines),
        running: machines.running
      });
    }
  }, [machineConfig]);

  return {
    machines,
    setMachineRunning
  };
};

export const DebuggerPortal = () => {
  const [code, setCode] = useState("default");
  const [initialInput, setInitialInput] = useState("");
  const [machineConfig, setMachineConfig] = useState<Array<MachineConfig>>([]);
  const [runningMachines, setRunningMachines] = useState<
    Array<Machine | UninitialisedMachineType>
  >([]);
  const { machines, setMachineRunning } = useMachineFactory(machineConfig);

  const addMachine = () => {
    setMachineConfig(
      machineConfig.concat([{ code, id: instanceId++, initialInput }])
    );
  };

  const handleSetOutput = (
    machine: UninitialisedMachineType,
    output: string
  ) => {
    if (output === "silent-running") {
      setMachineRunning(machine.silentRunning());
    } else if (output === "output-to-console") {
      setMachineRunning(machine.outputToConsole());
    } else {
      const id = parseInt(output.split("output-to-#")[1], 10);
      let otherMachine:
        | Machine
        | UninitialisedMachineType
        | undefined = machines.pending.find(m => m.config.id === id);
      if (!otherMachine)
        otherMachine = machines.running.find(m => m.config.id === id);
      if (otherMachine) {
        setMachineRunning(machine.outputToQueue(otherMachine.queue));
      }
    }
  };

  const posOuts = [
    "silent-running",
    "output-to-console",
    ...machines.pending.map(n => {
      return `output-to-#${n.config.id}`;
    }),
    ...machines.running.map(n => {
      return `output-to-#${n.config.id}`;
    })
  ];

  const stepAll = () => {
    machines.running.forEach(({ debug }) => {
      debug.step();
    });
  };

  return (
    <>
      <div className="MachineAdder">
        New:
        <label htmlFor="Code">code:</label>
        <select
          onChange={e => setCode(e.target.value)}
          value={code}
          name="Code"
        >
          {Object.keys(programs).map((m, i) => (
            <option key={i} value={m.toString()}>
              {m}
            </option>
          ))}
        </select>
        <label htmlFor="InitInput">Initial Input:</label>
        <input
          name="InitInput"
          value={initialInput}
          onChange={e => setInitialInput(e.target.value)}
        ></input>
        <button onClick={addMachine} name="Create">
          Create Instance
        </button>
      </div>
      <div key={"pending"} className="MachineContainers">
        {machines.pending.map((m: UninitialisedMachineType) => (
          <UninitialisedMachine
            key={m.config.id}
            machine={m}
            possibleOutputs={posOuts}
            onSetOutput={(output: string) => {
              handleSetOutput(m, output);
            }}
          />
        ))}
      </div>
      <button onClick={stepAll}>STEP ALL</button>
      <div key={"running"} className="MachineContainers">
        {machines.running.map((m: Machine) => (
          <IntcodeMachine key={m.config.id} machine={m as Machine} />
        ))}
      </div>
    </>
  );
};
