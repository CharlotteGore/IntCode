import source from "./input";

import { TestFunction } from "../hooks";
import { allPermutations, generate } from "../../Helpers/mashers";
import { createMachine, Machine } from "../../IntcodeMachine/machine";
import createIntcodePipe, {
  IntcodePipe
} from "../../IntcodeMachine/input-generators/pipe";
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

const starOne = async (_: string, params: Record<string, any>) => {
  // this is chained machines!
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let perms = allPermutations<number>(params.starOne);
      let max = -Infinity;

      for (let perm of perms) {
        let inputs: Array<IntcodePipe> = generate<IntcodePipe>(5, i => {
          let pipe = createIntcodePipe();
          pipe.setId("input" + i);
          return pipe;
        });

        let mainOutput = createIntcodePipe();
        mainOutput.setId("main output");

        let mainInput = inputs[0];
        mainInput.setId("main input");

        let io: {
          input?: IntcodePipe;
          output?: IntcodePipe;
        } = {};

        for (let i = 0; i < perm.length; i++) {
          if (i === perm.length - 1) {
            // last
            io.input = inputs[perm.length - 1];
            io.output = mainOutput;
          } else {
            io.input = inputs[i];
            io.output = inputs[i + 1];
          }
          inputs[i].addItem(perm[i]);

          createMachine({
            id: perm[i],
            code: "day7",
            io
          });
        }

        mainInput.addItem(0);

        let result = await mainOutput.generator().next();
        if (!result.done) {
          if (result.value > max) {
            max = result.value;
          }
        }
      }
      resolve(max);
    }, 10);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let perms = allPermutations<number>(params.starTwo);
      let max = -Infinity;

      for (let perm of perms) {
        let inputs: Array<IntcodePipe> = generate<IntcodePipe>(5, i => {
          let pipe = createIntcodePipe();
          pipe.setId("input" + i);
          return pipe;
        });

        let mainOutput = createIntcodePipe();
        mainOutput.setId("main output");

        let mainInput = inputs[0];
        mainInput.setId("main input");

        let io: {
          input?: IntcodePipe;
          output?: IntcodePipe;
        } = {};

        for (let i = 0; i < perm.length; i++) {
          if (i === perm.length - 1) {
            // last
            io.input = inputs[perm.length - 1];
            io.output = mainOutput;
          } else {
            io.input = inputs[i];
            io.output = inputs[i + 1];
          }
          inputs[i].addItem(perm[i]);

          createMachine({
            id: perm[i],
            code: "day7",
            io
          });
        }

        mainInput.addItem(0);

        while (true) {
          let result = await mainOutput.generator().next();
          if (!result.done) {
            mainInput.addItem(result.value);
            if (result.value > max) {
              max = result.value;
            }
          } else {
            break;
          }
        }
      }
      resolve(max);
      /*
      const permutations = allPermutations([5, 6, 7, 8, 9]);
      let max = -Infinity;
      for (const permutation of permutations) {
        let outputs: Array<IntcodePipe> = [];
        let machines: Array<Machine> = [];
        let mainOutput = createQueueInput([]);
        let mainInput = createQueueInput([]);
        for (let i = 0; i < permutation.length; i++) {
          let input: IntcodePipe = createQueueInput([permutation[i]]);
          let output: IntcodePipe;
          if (i === 0) {
            mainInput = input;
            output = createQueueInput([]);
          } else if (i === permutation.length - 1) {
            output = mainOutput;
            queueConnector(outputs[i - 1], input);
          } else {
            output = createQueueInput([]);
            queueConnector(outputs[i - 1], input);
          }

          outputs.push(output);

          let pending = createMachine(
            {
              id: permutation[i],
              code: "day7",
              initialInput: ""
            },
            input
          );

          let machine = pending.outputToQueue(output);
          machine.debug.run();
          machines.push(machine);
        }
        let mainOutputGenerator = monitoringQueueConnector(
          outputs[permutation.length - 1],
          mainInput,
          machines[machines.length - 1].debug
        );
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

      resolve(max);
      */
      resolve("Broken, needs fixing");
    }, 10);
  });
};

export default runner;
