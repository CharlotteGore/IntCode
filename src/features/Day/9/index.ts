import source from "./input";
import tests from "./tests";
import { toIntArray, toLines, csvToIntArray } from "../../Helpers/parsers";
import { createMachine } from "../../IntcodeMachine/machine";

import { TestFunction } from "../hooks";
import createNullInput from "../../IntcodeMachine/input-generators/null";
import Debugger from "../../IntcodeMachine/intcode-debugger";
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
  machine.debug.step();
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
  machine.debug.step();
  const g = queue.generator();
  const r = await g.next();
  console.log(r);
  return r.value;
};

export default runner;
