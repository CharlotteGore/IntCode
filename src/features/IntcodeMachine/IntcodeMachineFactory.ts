import intcodeRunner, { IntcodeRunner } from "./intcode-runner";
import Debugger from "./intcode-debugger";
import { day2, day5, day7, test } from "./programs";
import parse from "./intcode-parser";
import createArrayInput from "./input-generators/array";
import createNullInput from "./input-generators/null";
import createPassthroughInput, {
  MonitorFunction
} from "./input-generators/passthrough";

let instanceId = 0;

export type IntcodeMachine = [IntcodeRunner, Debugger];

export type ParallelIntcodeMachine = [
  IntcodeRunner,
  Debugger,
  {
    setSourceRunner: (source: IntcodeRunner) => void;
    setInitialValues: (values: Array<number>) => void;
    setDebugMonitor: (fn: MonitorFunction) => void;
    generator: () => AsyncGenerator<number, null, boolean>;
  }
];

const createStub = (): IntcodeMachine => {
  const input = createNullInput();
  const program = parse("99");
  const debug = new Debugger(instanceId++);
  const runner = intcodeRunner(program, input.generator(), debug, instanceId);
  return [runner, debug];
};

const createDay2 = (): IntcodeMachine => {
  const input = createNullInput();
  const program = parse(day2);
  const debug = new Debugger(instanceId++);
  const runner = intcodeRunner(program, input.generator(), debug, instanceId);
  return [runner, debug];
};

const createDay5 = (): IntcodeMachine => {
  const input = createArrayInput([5]);
  const program = parse(day5);
  const debug = new Debugger(instanceId++);
  const runner = intcodeRunner(program, input.generator(), debug, instanceId);
  return [runner, debug];
};

const createDay7 = (): ParallelIntcodeMachine => {
  const input = createPassthroughInput();
  //const program = parse(day7);
  const program = parse(test);
  const debug = new Debugger(instanceId++);
  const runner = intcodeRunner(program, input.generator(), debug, instanceId);
  return [runner, debug, input];
};

export const createIntcodeMachine = (id: string) => {
  if (id === "day2") {
    return createDay2();
  } else if (id === "day5") {
    return createDay5();
  } else {
    return createStub();
  }
};

export const createParallelIntcodeMachine = () => {
  return createDay7();
};
