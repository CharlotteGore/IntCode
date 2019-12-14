import React, { useState, useEffect } from "react";
import programs from "../IntcodeMachine/programs";
import IntcodeMachine from "../IntcodeMachine";
import "./debuggerportal.css";
import {
  Machine,
  MachineConfig,
  createDebugMachine,
  DebugMachine
} from "../IntcodeMachine/machine";

import UninitialisedMachine from "../IntcodeMachine/UnitiatialisedMachine";
import createIntcodePipe, {
  IntcodePipe
} from "../IntcodeMachine/input-generators/pipe";

let instanceId = 1;

const useMachineFactory = (machineConfig: Array<MachineConfig>) => {
  const [machines, setMachines] = useState<{
    pending: Array<MachineConfig>;
    running: Array<DebugMachine>;
  }>({ pending: [], running: [] });

  const setMachineRunning = (machine: MachineConfig, output?: IntcodePipe) => {
    const id = machine.id;
    const pendingMachine = machines.pending.find(m => m.id === id);
    if (pendingMachine) {
      machines.pending.splice(machines.pending.indexOf(pendingMachine), 1);
      let runningMachine = createDebugMachine(pendingMachine);
      machines.running.push(runningMachine);
    }
    setMachines({
      pending: machines.pending,
      running: machines.running
    });
  };

  useEffect(() => {
    const newMachines = machineConfig.reduce(
      (newMachines: Array<MachineConfig>, config) => {
        if (!machines.pending.find(m => m.id === config.id)) {
          config.io = {
            input: createIntcodePipe(),
            output: createIntcodePipe()
          };
          newMachines.push(config);
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
    // eslint-disable-next-line
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
  const { machines, setMachineRunning } = useMachineFactory(machineConfig);

  const addMachine = () => {
    setMachineConfig(
      machineConfig.concat([{ code, id: instanceId++, initialInput }])
    );
  };

  const handleSetOutput = (machine: MachineConfig, output: string) => {
    if (output === "to-screen") {
      setMachineRunning(machine);
    } else {
      const id = parseInt(output.split("output-to-#")[1], 10);
      let pending: MachineConfig | undefined = machines.pending.find(
        m => m.id === id
      );
      if (pending !== undefined) {
        if (pending.io && pending.io.input) {
          machine.io!.output = pending.io.input;
          setMachineRunning(machine);
        }
      } else {
        let running: DebugMachine | undefined = machines.running.find(
          m => m.config.id === id
        );
        if (running !== undefined) {
          machine.io!.output = running.input;
          setMachineRunning(machine);
        }
      }
    }
  };

  const posOuts = [
    "to-screen",
    ...machines.pending.map(n => {
      return `output-to-#${n.id}`;
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
        {machines.pending.map((m: MachineConfig) => (
          <UninitialisedMachine
            key={m.id}
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
          <IntcodeMachine key={m.config.id} machine={m as DebugMachine} />
        ))}
      </div>
    </>
  );
};
