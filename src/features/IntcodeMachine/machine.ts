import intcodeRunner from "./intcode-runner";
import createQueueInput, { IntcodePipe } from "./input-generators/pipe";
import Debugger from "./intcode-debugger";
import parse from "./intcode-parser";
import programs from "./programs";
import { csvToIntArray } from "../Helpers/parsers";

export type MachineConfig = {
  code: string;
  id: number;
  initialInput?: string;
  io?: {
    input?: IntcodePipe;
    output?: IntcodePipe;
  };
};

export type Machine = {
  config: MachineConfig;
  input: IntcodePipe;
  output: IntcodePipe;
};

export type DebugMachine = {
  debug: Debugger;
} & Machine;

export type MonitorCallback = (value: number | null) => void;
export type OutputResultsCallback = (results: Array<number>) => void;

export const createMachine = (config: MachineConfig): Machine => {
  let input: IntcodePipe;
  let output: IntcodePipe;
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
  const codeSrc = programs[config.code];
  const program = parse(codeSrc);
  const runner = intcodeRunner(program, input, output, null);
  return {
    config: config,
    input,
    output
  };
};

export const createDebugMachine = (config: MachineConfig): DebugMachine => {
  let input: IntcodePipe;
  let output: IntcodePipe;
  let debug = new Debugger(config.id);
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
  const codeSrc = programs[config.code];
  const program = parse(codeSrc);
  const runner = intcodeRunner(program, input, output, debug);
  return {
    config: config,
    input,
    output,
    debug
  };
};
