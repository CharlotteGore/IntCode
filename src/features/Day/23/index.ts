import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import { createShittyMachine } from "../../IntcodeMachine/machine";
import { isElement } from "react-dom/test-utils";

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
        let inputs: number[][] = [];

        let getMachineIo = (id: number) => {
          inputs[id] = [];
          return {
            input: (): number => {
              if (inputs[id].length === 0) {
                onMachineInput(id, -1);
                return -1;
              } else {
                let val = inputs[id].pop()!;
                onMachineInput(id, val);
                return val;
              }
            },
            output: (value: number) => {
              onMachineOutput(id, value);
            }
          };
        };

        let injectValueToMachine = (id: number, value: number) => {
          inputs[id].unshift(value);
        };

        return {
          getMachineIo,
          injectValueToMachine
        };
      };

      let outputTracker = new Map<number, number[]>();

      let instructions: number[][] = [];

      let io = createIo(
        (sourceMachine: number, value: number) => {
          // this is called every time a machine outputs
          let cached = outputTracker.get(sourceMachine);
          if (cached === undefined || cached.length === 0) {
            outputTracker.set(sourceMachine, [value]);
          } else if (cached.length === 2) {
            if (cached[0] === 255) {
              console.log(
                `Machine ${sourceMachine} outputted ${cached[0]} ${cached[1]} ${value}`
              );
              done = true;
              resolve(value);
            } else {
              //if (cached[0] !== 255) {
              instructions.push([cached[0], cached[1], sourceMachine]);
              instructions.push([cached[0], value, sourceMachine]);
              //} else {
              //  console.log("255!");
              // NAT.x = cached[1];
              // NAT.y = value;
            }
            outputTracker.set(sourceMachine, []);
            //}
          } else {
            outputTracker.set(sourceMachine, cached.concat(value));
            //if (id !== 255) {
            //  io.injectValueToMachine(cached[0], cached[1]);
            //}
          }
        },
        (id: number, value: number) => {}
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
          console.log(
            `Machine ${instructions[i][2]} emitted ${instructions[i][0]} ${instructions[i][1]}`
          );
          io.injectValueToMachine(instructions[i][0], instructions[i][1]);
        }
        instructions = [];
      }
    }, 10);
  });
};

const starTwo = (program: number[], params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let done = false;

      let idleMachines: number[] = [];

      let createIo = (
        onMachineOutput: (id: number, value: number) => void,
        onMachineInput: (id: number, value: number) => void
      ) => {
        let inputs: number[][] = [];

        let getMachineIo = (id: number) => {
          inputs[id] = [];
          let requestCount = 0;
          return {
            input: (): number => {
              // If all computers have empty incoming packet queues
              // and are continuously trying to receive packets
              // without sending packets, the network is considered idle.
              if (inputs[id].length === 0) {
                requestCount++;
                onMachineInput(id, -1);
                if (requestCount === 5) {
                  if (!idleMachines.includes(id)) {
                    idleMachines.push(id);
                  }
                }
                return -1;
              } else {
                requestCount = 0;
                if (idleMachines.includes(id)) {
                  console.log(`Machine ${id} is no longer idle`);
                  idleMachines.splice(idleMachines.indexOf(id), 1);
                }
                let val = inputs[id].pop()!;
                onMachineInput(id, val);
                return val;
              }
            },
            output: (value: number) => {
              requestCount = 0;
              if (idleMachines.includes(id)) {
                console.log(`Machine ${id} is no longer idle`);
                idleMachines.splice(idleMachines.indexOf(id), 1);
              }
              // If all computers have empty incoming packet queues
              // and are continuously trying to receive
              // packets without sending packets, the network is considered idle.
              onMachineOutput(id, value);
            }
          };
        };

        let injectValueToMachine = (id: number, value: number) => {
          inputs[id].unshift(value);
        };

        return {
          getMachineIo,
          injectValueToMachine
        };
      };

      let outputTracker = new Map<number, number[]>();

      let instructions: number[][] = [];

      let NAT: { x: number; y: number } = {
        x: -1,
        y: -1
      };

      let NATys: number[] = [];

      let io = createIo(
        (sourceMachine: number, value: number) => {
          // this is called every time a machine outputs
          let cached = outputTracker.get(sourceMachine);
          if (cached === undefined || cached.length === 0) {
            outputTracker.set(sourceMachine, [value]);
          } else if (cached.length === 2) {
            if (cached[0] === 255) {
              NAT.x = cached[1];
              NAT.y = value;
              console.log(
                `Machine ${sourceMachine} outputted ${cached[0]} ${cached[1]} ${value}`
              );
            } else {
              instructions.push([cached[0], cached[1], sourceMachine]);
              instructions.push([cached[0], value, sourceMachine]);
            }
            outputTracker.set(sourceMachine, []);
          } else {
            outputTracker.set(sourceMachine, cached.concat(value));
          }
        },
        (id: number, value: number) => {}
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
        for (let i = 0; i < 50; i++) {
          runners[i].step();
        }
        for (let i = 0; i < instructions.length; i++) {
          io.injectValueToMachine(instructions[i][0], instructions[i][1]);
        }
        instructions = [];

        if (idleMachines.length === 50) {
          console.log("all machines are idle", NAT.x, NAT.y);
          io.injectValueToMachine(0, NAT.x);
          io.injectValueToMachine(0, NAT.y);
          if (NATys.includes(NAT.y)) {
            console.log("done");
            done = true;
            resolve(NAT.y);
          } else {
            NATys.push(NAT.y);
          }
          idleMachines.splice(idleMachines.indexOf(0), 1);
        }
      }
      // resolve("Not Implemented");
    }, 1000);
  });
};

export default runner;
