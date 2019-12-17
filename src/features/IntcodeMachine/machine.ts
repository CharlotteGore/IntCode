import intcodeRunner, { IntcodeProgram } from "./intcode-runner";
import createQueueInput, { IntcodePipe } from "./input-generators/pipe";
import Debugger from "./intcode-debugger";
import parse from "./intcode-parser";
import programs from "./programs";
import { csvToIntArray } from "../Helpers/parsers";

let defaultInstanceId: number = 0;

export type BasicMachineConfig = {
  id?: number | string;
  initialInput?: string;
  io?: {
    input?: IntcodePipe;
    output?: IntcodePipe;
  };
  pc?: number;
  rb?: number;
};

export type MachineConfigWithCode = BasicMachineConfig & {
  code: string;
};

export type MachineConfigWithProgram = BasicMachineConfig & {
  program: IntcodeProgram;
};

export type MachineConfig = MachineConfigWithCode | MachineConfigWithProgram;

export const isWithCode = (
  config: MachineConfig
): config is MachineConfigWithCode => {
  return !!(config as MachineConfigWithCode).code;
};

export const isWithProgram = (
  config: MachineConfig
): config is MachineConfigWithProgram => {
  return !!(config as MachineConfigWithProgram).program;
};

export type Machine = {
  config: MachineConfig;
  input: IntcodePipe;
  output: IntcodePipe;
  clone: () => Machine;
};

export type DebugMachine = {
  debug: Debugger;
} & Machine;

export type MonitorCallback = (value: number | null) => void;
export type OutputResultsCallback = (results: Array<number>) => void;

export const createMachine = (config: MachineConfig): Machine => {
  let input: IntcodePipe;
  let output: IntcodePipe;
  let program: number[] = [];
  if (config.io && config.io.input) {
    input = config.io.input;
  } else {
    const initialInput = config.initialInput
      ? csvToIntArray(config.initialInput)
      : [];
    input = createQueueInput(initialInput);
  }
  if (config.io && config.io.output) {
    output = config.io.output;
  } else {
    output = createQueueInput();
  }

  let id = config.id ? config.id : ++defaultInstanceId;

  if (isWithCode(config)) {
    const codeSrc = programs[config.code];
    program = parse(codeSrc);
  }

  if (isWithProgram(config)) {
    program = config.program;
  }

  const runner = intcodeRunner(
    program,
    input,
    output,
    null,
    config.pc || 0,
    config.rb || 0
  );
  runner.run();

  return {
    config: config,
    input,
    output,
    clone: () => {
      const i = createQueueInput();
      const o = createQueueInput();
      const [p, pc, rb] = runner.cloneData();
      return createMachine({
        id: `${id}_clone`,
        program: p,
        pc,
        rb,
        io: {
          input: i,
          output: o
        }
      });
    }
  };
};

export const createDebugMachine = (config: MachineConfig): DebugMachine => {
  let input: IntcodePipe;
  let output: IntcodePipe;
  let program: number[] | null = [];
  let id: number | string = config.id || ++defaultInstanceId;
  let debug: Debugger = new Debugger(id);
  if (config.io && config.io.input) {
    input = config.io.input;
  } else {
    const initialInput = config.initialInput
      ? csvToIntArray(config.initialInput)
      : [];
    input = createQueueInput(initialInput);
  }
  if (config.io && config.io.output) {
    output = config.io.output;
  } else {
    output = createQueueInput();
  }

  if (isWithCode(config)) {
    const codeSrc = programs[config.code];
    program = parse(codeSrc);
  }

  if (isWithProgram(config)) {
    program = config.program;
  }

  if (program === null) {
    throw new Error("No program or code setup");
  }

  const runner = intcodeRunner(
    program,
    input,
    output,
    debug,
    config.pc || 0,
    config.rb || 0
  );
  runner.run();

  return {
    config: config,
    input,
    output,
    debug,
    clone: () => {
      const i = createQueueInput();
      const o = createQueueInput();
      const [p, pc, rb] = runner.cloneData();
      return createDebugMachine({
        id: `${id}_clone`,
        program: p,
        pc,
        rb,
        io: {
          input: i,
          output: o
        }
      });
    }
  };
};
