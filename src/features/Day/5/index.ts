import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import createQueueInput from "../../IntcodeMachine/input-generators/queue";
import { createMachine } from "../../IntcodeMachine/machine";
import { Vector2d, UnitVector2d, add } from "../../Helpers/vector";
import { RefObject } from "react";
import { COLOR } from "../8";

const runner = async (
  star: string,
) => {
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
  const init = createMachine({
    id: 0,
    code: "day5",
    initialInput: params.starOne.toString()
  });

  const output = createQueueInput([]);
  const machine = init.outputToQueue(output);
  machine.debug.run();

  while(true) {
    const out = await output.generator().next();
    if (!out.done) {
      if (out.value !== 0) {
        return out.value.toString();
      }  
    } 
  }

};

const starTwo = async (_: string, params: Record<string, any>) => {
  const init = createMachine({
    id: 0,
    code: "day5",
    initialInput: params.starTwo.toString()
  });


  const output = createQueueInput([]);
  const machine = init.outputToQueue(output);
  machine.debug.run();

  while(true) {
    const out = await output.generator().next();
    if (!out.done) {
      if (out.value !== 0) {
        return out.value.toString();
      }  
    } 
  }
};

export default runner;
