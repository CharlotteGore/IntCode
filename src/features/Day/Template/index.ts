import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";

const runner: TestFunction = (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = starOne(input, params);
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    const testCases = tests[2];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = starOne(input, params);
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const starOne = (input: string, params: Record<string, any>) => {
  return "Not Implemented";
};

const starTwo = (input: string, params: Record<string, any>) => {
  return "Not Implemented";
};

export default runner;