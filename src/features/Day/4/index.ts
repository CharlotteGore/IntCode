import source from "./input";
import tests from "./tests";

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

const numToArray = (num: number) => {
  let units = Math.pow(10, (Math.log(num) * Math.LOG10E + 1) | 0) / 10;
  let result: Array<number> = [];
  while (units > 1) {
    result.push(~~(num / units));
    num = num - result[result.length - 1] * units;
    units = units / 10;
  }
  result.push(num);
  return result;
};

const starOne = (input: string, params: Record<string, any>) => {
  const [min, max] = input.split(/-/).map((m: string) => parseInt(m, 10));
  let validCombos = 0;
  for (let i = min; i < max + 1; i = i + 1) {
    let digits = numToArray(i);
    let pairFound = false;
    let tooManyPairs = false;
    let decreasing = false;
    for (let j = 1; j < digits.length; j++) {
      if (digits[j - 1] === digits[j]) {
        pairFound = true;
        if (j < digits.length - 1 && digits[j] === digits[j + 1])
          pairFound = false;
      }
      if (digits[j - 1] > digits[j]) decreasing = true;
    }
    if (pairFound && !decreasing && !tooManyPairs) {
      validCombos++;
    }
  }
  return validCombos.toString();
};

const starTwo = (input: string, params: Record<string, any>) => {
  const [min, max] = input.split(/-/).map((m: string) => parseInt(m, 10));
  let validCombos = 0;
  for (let i = min; i < max + 1; i++) {
    let digits = numToArray(i);
    let fuckedIt = false;
    let l: Record<number, number> = { [digits[0]]: 1 };
    for (let j = 1; j < digits.length; j++) {
      if (digits[j - 1] > digits[j]) fuckedIt = true;
      l[digits[j]] = l[digits[j]] + 1 || 1;
    }
    if (!fuckedIt && Object.values(l).find(a => a === 2)) validCombos++;
  }
  return validCombos.toString();
};

export default runner;
