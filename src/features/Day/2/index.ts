import source from "./input";
import { createMachine } from "../../IntcodeMachine/machine";

import { TestFunction } from "../hooks";
import createQueueInput from "../../IntcodeMachine/input-generators/queue";
import createNullInput from "../../IntcodeMachine/input-generators/null";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { input, params } = source;
    const result = await starOne(input, params);
    output.push(`Actual result: ${result}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star two test...
    const { input, params } = source;
    const result = await starTwo(input, params);
    output.push(`Actual result: ${result}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const starOne = async (input: string, params: Record<string, any>) => {
  const init = createMachine({
    id: 0,
    code: "day2",
    initialInput: "1"
  });
  const queue = createNullInput();
  const machine = init.silentRunning();

  machine.debug.poke(1, 12);
  machine.debug.poke(2, 2);

  machine.debug.run();
  while(true) {
    const val = await machine.runner.next();
    if (val.done) {
      break;
    }
  }
  return machine.debug.peek(0);
};

const starTwo = async (input: string, params: Record<string, any>) => {
  const runTest = async (a: number, b: number) => {
    const init = createMachine({
      id: 0,
      code: "day2",
      initialInput: "1"
    });
    const queue = createNullInput();
    const machine = init.silentRunning();
  
    machine.debug.poke(1, a);
    machine.debug.poke(2, b);
  
    machine.debug.run();
    while(true) {
      const val = await machine.runner.next();
      if (val.done) {
        break;
      }
    }
    return machine.debug.peek(0);
  }

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      let result = await runTest(i, j);
      if (result === 19690720) {
        return (100 * i + j);
      }
    }
  }

};

export default runner;
