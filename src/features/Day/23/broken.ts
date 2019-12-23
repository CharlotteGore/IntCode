import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import { createShittyMachine } from "../../IntcodeMachine/machine";

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
      let done = false;

      let createIo = (
        onMachineOutput: (id: number, value: number) => void,
        onMachineInput: (id: number, value: number) => void
      ) => {
        let array: number[][] = [];

        let getMachineIo = (id: number) => {
          array[id] = [];
          return {
            input: (): number => {
              if (array[id].length === 0) {
                onMachineInput(id, -1);
                return -1;
              } else {
                let val = array[id].pop()!;
                onMachineInput(id, val);
                return val;
              }
            },
            output: (value: number) => {
              array[id].unshift(value);
              onMachineOutput(id, value);
            }
          };
        };

        let injectValueToMachine = (id: number, value: number) => {
          array[id].unshift(value);
        };

        return {
          getMachineIo,
          injectValueToMachine
        };
      };

      let outputTracker = new Map<number, number[]>();

      let instructions: number[][] = [];

      let io = createIo(
        (id: number, value: number) => {
          debugger;
          // this is called every time a machine outputs
          let cached = outputTracker.get(id);
          if (cached === undefined || cached.length === 0) {
            outputTracker.set(id, [value]);
          } else if (cached.length === 2) {
            if (cached[0] === 255) {
              console.log(
                `Machine ${id} outputted ${cached[0]} ${cached[1]} ${value}`
              );
              done = true;
              resolve(value);
            } else {
              instructions.push([cached[0], cached[1], id]);
              instructions.push([cached[0], value, id]);
              //io.injectValueToMachine(cached[0], cached[1]);
              //io.injectValueToMachine(cached[0], value);
              outputTracker.set(id, []);
            }
          } else {
            outputTracker.set(id, cached.concat(value));
            //if (id !== 255) {
            //  io.injectValueToMachine(cached[0], cached[1]);
            //}
          }
        },
        (id: number, value: number) => {
          // this is called every time a machine requests a value;
          // console.log(`Machine ${id} has read ${value}`);
        }
      );
      let runners: { step: () => false | null | undefined }[] = [];

      // set up the machines
      for (let i = 0; i < 50; i++) {
        const { input, output } = io.getMachineIo(i);
        runners[i] = createShittyMachine({ program }, input, output, i);
        // add the initial value;
        io.injectValueToMachine(i, i);
      }

      while (!done) {
        console.log("cycle");
        for (let i = 0; i < 50; i++) {
          runners[i].step();
        }
        for (let i = 0; i < instructions.length; i++) {
          //console.log(
          //  `Machine ${instructions[i][2]} outputted ${instructions[i][0]} ${instructions[i][1]}`
          //);
          io.injectValueToMachine(instructions[i][0], instructions[i][1]);
        }
        instructions = [];
      }
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
