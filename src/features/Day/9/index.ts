import source from "./input";
import { createMachine } from "../../IntcodeMachine/machine";

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

const starOne = async (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { output, input } = createMachine({
        id: 0,
        code: "day9",
        initialInput: params.starOne.toString()
      });

      for (const value of params.starOne) {
        input.addItem(value);
      }

      while (true) {
        const out = await output.generator().next();
        if (!out.done) {
          if (out.value !== 0) {
            resolve(out.value);
          }
        }
      }
    }, 10);
  });
};

const starTwo = async (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { output, input } = createMachine({
        id: 0,
        code: "day9",
        initialInput: params.starTwo.toString()
      });

      for (const value of params.starTwo) {
        input.addItem(value);
      }

      while (true) {
        const out = await output.generator().next();
        if (!out.done) {
          if (out.value !== 0) {
            resolve(out.value);
          }
        }
      }
    }, 10);
  });
};

export default runner;
