import source from "./input";
import { createMachine } from "../../IntcodeMachine/machine";

import { TestFunction } from "../hooks";
import createQueueInput from "../../IntcodeMachine/input-generators/queue";

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
    code: "day9",
    initialInput: "1"
  });
  const queue = createQueueInput([]);
  const machine = init.outputToQueue(queue);
  machine.debug.run();
  let r = await queue.generator().next();
  return r.value;
};

const starTwo = async (input: string, params: Record<string, any>) => {
  const init = createMachine({
    id: 0,
    code: "day9",
    initialInput: "2"
  });
  const queue = createQueueInput([]);
  const machine = init.outputToQueue(queue);
  machine.debug.run();
  let r = await queue.generator().next();
  return r.value;
};

export default runner;
