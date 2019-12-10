import source from "./input";
import { lsvToIntArray } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";

const runner: TestFunction = (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const calcFuel = (v: number) => ~~(v / 3) - 2;

const starOne = (input: string, params: Record<string, any>) => {
  return lsvToIntArray(input)
    .reduce((sum, v) => {
      return sum + calcFuel(v);
    }, 0)
    .toString();
};

const starTwo = (input: string, params: Record<string, any>) => {
  return lsvToIntArray(input)
    .reduce((sum, v) => {
      let fuel = 0;
      while (true) {
        v = calcFuel(v);
        if (v <= 0) {
          break;
        }
        fuel += v;
      }
      return sum + fuel;
    }, 0)
    .toString();
};

export default runner;
