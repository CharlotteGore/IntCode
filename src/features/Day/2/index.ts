import source from "./input";
import { createDebugMachine } from "../../IntcodeMachine/machine";

import { TestFunction } from "../hooks";

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

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { output, debug } = createDebugMachine({
        id: 0,
        code: "day2"
      });

      debug.poke(1, 1);
      debug.poke(2, 12);
      debug.run();

      await output.generator().next();
      resolve(debug.peek(0));
    }, 10);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const runTest = async (a: number, b: number) => {
        const { output, debug } = createDebugMachine({
          id: 0,
          code: "day2"
        });

        debug.poke(1, a);
        debug.poke(2, b);
        debug.run();

        await output.generator().next();
        return debug.peek(0);
      };

      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
          let result = await runTest(i, j);
          if (result === 19690720) {
            resolve(100 * i + j);
          }
        }
      }
    }, 10);
  });
};

export default runner;
