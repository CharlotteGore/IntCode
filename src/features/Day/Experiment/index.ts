import intcodeRunner, {
  IntcodeRunner
} from "../../IntcodeMachine/intcode-runner";
import createQueueInput, {
  QueueInput
} from "../../IntcodeMachine/input-generators/queue";
import createNullInput from "../../IntcodeMachine/input-generators/null";
import Debugger from "../../IntcodeMachine/intcode-debugger";
import programs from "../../IntcodeMachine/programs";
import parse from "../../IntcodeMachine/intcode-parser";

import { TestFunction } from "../hooks";

const outputToInstance = async (
  runner: IntcodeRunner,
  queueInput: QueueInput
) => {
  while (true) {
    let val = await runner.next();
    if (val.done !== true) {
      queueInput.addItem(val.value);
    } else {
      break;
    }
  }
};

const outputToConsole = async (runner: IntcodeRunner) => {
  while (true) {
    let val = await runner.next();
    if (val.done !== true) {
      console.log(val.value);
    } else {
      break;
    }
  }
};

const experiment: TestFunction = (star: string) => {
  let output: Array<string> = [];
  const aInput = createNullInput();
  const bInput = createQueueInput([]);
  const aDebugger = new Debugger(0);
  const bDebugger = new Debugger(1);
  const aProgram = parse(programs["output-10-to-1"]);
  const bProgram = parse(programs["add-inputs"]);

  const a = intcodeRunner(aProgram, aInput.generator(), aDebugger, 0);
  const b = intcodeRunner(bProgram, bInput.generator(), bDebugger, 1);

  outputToInstance(a, bInput);
  outputToConsole(b);

  return output.join(" - ");
};

export default experiment;

/*
def sum
def input
def loops
def step

:start
add 0 10 loops
add 0 -1 step

:loop
rea input
add sum input sum
add loops step loops
jpt loops loop
:end
wri sum
hcf
*/
