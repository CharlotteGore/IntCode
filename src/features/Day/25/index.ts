import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { IntcodePipe } from "../../IntcodeMachine/input-generators/pipe";
import { createMachine } from "../../IntcodeMachine/machine";

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

const NEWLINE = "\n".charCodeAt(0);

const writeLine = (pipe: IntcodePipe, line: string) => {
  for (const c of Array.from(line)) {
    pipe.addItem(c.charCodeAt(0));
  }
  pipe.addItem(NEWLINE);
};

const readLine = (
  generator: AsyncGenerator<number, null, boolean>
): Promise<string> => {
  return new Promise(async resolve => {
    let str = "";
    while (true) {
      let a = await generator.next();
      if (!a.done) {
        debugger;
        let c = String.fromCharCode(a.value);
        if (a.value === NEWLINE) {
          resolve(str);
          break;
        } else if (a.value > 127) {
          resolve("INT: " + a.value.toString());
          break;
        } else {
          str += c;
        }
      } else {
        resolve("Code halted");
        break;
      }
    }
  });
};

declare global {
  interface Window {
    w: any;
  }
}

const starOne = (program: number[], params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { output, input } = createMachine({ program });
      window.w = writeLine.bind(null, input);
      while (true) {
        let val = await readLine(output.generator());
        console.log(val);
      }
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
