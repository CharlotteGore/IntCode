import intcodeRunner, { IntcodeRunner } from "./intcode-runner";
import createQueueInput, { QueueInput } from "./input-generators/queue";
import createNullInput, { NullInput } from "./input-generators/null";
import Debugger from "./intcode-debugger";
import parse from "./intcode-parser";
import programs from "./programs";
import { csvToIntArray } from "../Helpers/parsers";

export type MachineConfig = {
  code: string;
  id: number;
  initialInput: string;
};

export type Machine = {
  config: MachineConfig;
  debug: Debugger;
  runner: IntcodeRunner;
  initialised: boolean;
  queue: QueueInput;
};

export type MonitorCallback = (value: number | null) => void;

export type UninitialisedMachineType = {
  config: MachineConfig;
  queue: QueueInput;
  initialised: boolean;
  outputToQueue: (queue: QueueInput) => Machine;
  silentRunning: () => Machine;
  outputToConsole: () => Machine;
};

const outputToQueue = async (
  runner: IntcodeRunner,
  queueInput: QueueInput,
  monitorCb?: MonitorCallback
) => {
  while (true) {
    let val = await runner.next();
    if (val.done !== true) {
      if (monitorCb) monitorCb(val.value);
      queueInput.addItem(val.value);
    } else {
      if (monitorCb) monitorCb(val.value);
      break;
    }
  }
};

const silentRunning = async (
  runner: IntcodeRunner,
  monitorCb?: MonitorCallback
) => {
  while (true) {
    let val = await runner.next();
    if (val.done !== true) {
      if (monitorCb) monitorCb(val.value);
    } else {
      if (monitorCb) monitorCb(val.value);
      break;
    }
  }
};

const outputToConsole = async (
  runner: IntcodeRunner,
  monitorCb?: MonitorCallback
) => {
  while (true) {
    let val = await runner.next();
    if (val.done !== true) {
      if (monitorCb) monitorCb(val.value);
      console.log(val.value);
    } else {
      if (monitorCb) monitorCb(val.value);
      break;
    }
  }
};

export const createMachine = (
  config: MachineConfig
): UninitialisedMachineType => {
  const initialQueue = csvToIntArray(config.initialInput) || [];
  const debug = new Debugger(config.id);
  const input = createQueueInput(initialQueue);
  const codeSrc = programs[config.code];
  const program = parse(codeSrc);
  return {
    config: config,
    queue: input,
    initialised: false,
    silentRunning: () => {
      const runner = intcodeRunner(
        program,
        input.generator(),
        debug,
        config.id
      );
      silentRunning(runner, debug.onValue.bind(debug));
      return {
        config: config,
        debug,
        runner,
        queue: input,
        initialised: true
      };
    },
    outputToConsole: () => {
      const runner = intcodeRunner(
        program,
        input.generator(),
        debug,
        config.id
      );
      outputToConsole(runner, debug.onValue.bind(debug));
      return {
        config: config,
        debug,
        runner,
        initialised: true,
        queue: input
      };
    },
    outputToQueue: (queue: QueueInput) => {
      const runner = intcodeRunner(
        program,
        input.generator(),
        debug,
        config.id
      );
      outputToQueue(runner, queue, debug.onValue.bind(debug));
      return {
        config: config,
        debug,
        runner,
        initialised: true,
        queue: input
      };
    }
  };
};
