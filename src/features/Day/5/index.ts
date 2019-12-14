import source from "./input";
import createQueueInput from "../../IntcodeMachine/input-generators/pipe";
import { createMachine } from "../../IntcodeMachine/machine";

const runner = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const starOne = async (_: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { output } = createMachine({
        id: 0,
        code: "day5",
        initialInput: params.starOne.toString()
      });

      while (true) {
        const out = await output.generator().next();
        if (!out.done) {
          if (out.value !== 0) {
            resolve(out.value.toString());
          }
        }
      }
    });
  });
};

const starTwo = async (_: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { output } = createMachine({
        id: 0,
        code: "day5",
        initialInput: params.starTwo.toString()
      });

      while (true) {
        const out = await output.generator().next();
        if (!out.done) {
          if (out.value !== 0) {
            resolve(out.value.toString());
          }
        }
      }
    });
  });
};

export default runner;
