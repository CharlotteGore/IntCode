import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { allPermutations } from "../../Helpers/mashers";
import { createMachine, Machine } from "../../IntcodeMachine/machine";
import createQueueInput, { QueueInput } from "../../IntcodeMachine/input-generators/queue";
import Debugger from "../../IntcodeMachine/intcode-debugger";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${await starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const queueConnector = async (from: QueueInput, to: QueueInput) => {
  while(true) {
    let val = await from.generator().next();
    if (val.done) {
      break;
    } else {
      to.addItem(val.value);
    }
  }
}

async function* monitoringQueueConnector (from: QueueInput, to: QueueInput, debug: Debugger): AsyncGenerator<number, null, boolean> {
  const fromGen = from.generator();
  while(!debug.onFire) {
    let val = await fromGen.next();
    if (val.done) {
      break;
    } else {
      to.addItem(val.value);
      yield val.value;
    }
  }
  return null;
}

const starOne = async (input: string, params: Record<string, any>) => {
  // this is chained machines
  const permutations = allPermutations([0,1,2,3,4]);
  let max = -Infinity;
  let winningPerm: Array<number> = [];
  for (const permutation of permutations) {
    debugger;
    let outputs: Array<QueueInput> = [];
    let machines: Array<Machine> = [];
    let mainOutput = createQueueInput([]);
    let mainInput = createQueueInput([]);
    for (let i = 0; i < permutation.length; i++) {
      let input: QueueInput = createQueueInput([permutation[i]]);
      let output: QueueInput;
      if (i === 0) {
        mainInput = input;
        output = createQueueInput([]);
      } else if (i === permutation.length -1) {
        output = mainOutput;
        queueConnector(outputs[i - 1], input);
      } else {
        output = createQueueInput([]);
        queueConnector(outputs[i - 1], input);
      }

      outputs.push(output);

      let pending = createMachine({ 
        id: permutation[i], 
        code: 'day7',
        initialInput: ''
      }, input);

      let machine = pending.outputToQueue(output)
      machine.debug.run();
      machines.push(machine);
    }
    mainInput.addItem(0);
    let result = await mainOutput.generator().next();
    if (!result.done) {
      if (result.value > max) {
        max = result.value;
        winningPerm = permutation;
      }
    }
  }

  return max;

};

const starTwo = async (input: string, params: Record<string, any>) => {
  const permutations = allPermutations([5,6,7,8,9]);
  let max = -Infinity;
  let winningPerm: Array<number> = [];
  for (const permutation of permutations) {
    debugger;
    let outputs: Array<QueueInput> = [];
    let machines: Array<Machine> = [];
    let mainOutput = createQueueInput([]);
    let mainInput = createQueueInput([]);
    for (let i = 0; i < permutation.length; i++) {
      let input: QueueInput = createQueueInput([permutation[i]]);
      let output: QueueInput;
      if (i === 0) {
        mainInput = input;
        output = createQueueInput([]);
      } else if (i === permutation.length -1) {
        output = mainOutput;
        queueConnector(outputs[i - 1], input);
      } else {
        output = createQueueInput([]);
        queueConnector(outputs[i - 1], input);
      }

      outputs.push(output);

      let pending = createMachine({ 
        id: permutation[i], 
        code: 'day7',
        initialInput: ''
      }, input);

      let machine = pending.outputToQueue(output)
      machine.debug.run();
      machines.push(machine);
    }
    let mainOutputGenerator = monitoringQueueConnector(outputs[permutation.length -1], mainInput, machines[machines.length -1].debug);
    mainInput.addItem(0);
    while (true) {
      let result = await mainOutputGenerator.next();
      if (!result.done) {
        if (result.value > max) {
          max = result.value;
        }
      } else {
        // combination tested
        break;
      }
    }
  }

  return max;
};

export default runner;
