import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import {
  createMachine,
  createDebugMachine
} from "../../IntcodeMachine/machine";
import { IntcodePipe } from "../../IntcodeMachine/input-generators/pipe";
import Debugger from "../../IntcodeMachine/intcode-debugger";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = await starOne(input, params).toString();
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    const testCases = tests[2];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = await starTwo(input, params).toString();
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${await starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const starOne = (program: number[], params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let inputs: IntcodePipe[] = [];
      // let outputs: IntcodePipe[] = [];
      let debuggers: Debugger[] = [];
      let done = false;

      // set up the machines
      for (let i = 0; i < 50; i++) {
        const { input, output, debug } = createDebugMachine({ program, id: i });
        input.setDefaultOutput(-1);
        input.addItem(i);
        inputs.push(input);
        // outputs.push(output);
        debuggers.push(debug);
        // eslint-disable-next-line no-loop-func
        setTimeout(async () => {
          let gen = output.generator();
          while (true) {
            let val = await gen.next();
            if (val.done) {
              break;
            } else {
              if (val.value === 255) {
                await gen.next();
                let y = await gen.next();
                done = true;
                resolve(y.value!);
                break;
              } else {
                let x = await gen.next();
                let y = await gen.next();
                inputs[val.value].addItem(x.value!);
                inputs[val.value].addItem(y.value!);
                console.log(`Machine ${i} emitted ${val.value} ${x.value}`);
                console.log(`Machine ${i} emitted ${val.value} ${y.value}`);
              }
            }
          }
        }, 0);
      }

      let stepAll = () => {
        return new Promise(res => {
          setTimeout(() => {
            console.log("cycle");
            for (let i = 0; i < 50; i++) {
              debuggers[i].step();
            }
            res();
          }, 1);
        });
      };

      debugger;

      let count = 500;
      while (!done && count > 0) {
        await stepAll();
        count--;
      }
      console.log(done);
      // resolve("Not Implemented");
    }, 1000);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Not Implemented");
    }, 1000);
  });
};

export default runner;
