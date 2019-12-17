import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import {
  createMachine,
  createDebugMachine
} from "../../IntcodeMachine/machine";
import { Vector2d } from "../../Helpers/vector";

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

enum Robot {
  UP = "^".charCodeAt(0),
  DOWN = "v".charCodeAt(0),
  LEFT = "<".charCodeAt(0),
  RIGHT = ">".charCodeAt(0),
  FALLING = "X".charCodeAt(0)
}

// eslint-disable-next-line
const directionVectors: Record<Robot, Vector2d> = {
  [Robot.UP]: [0, -1],
  [Robot.DOWN]: [0, 1],
  [Robot.LEFT]: [-1, 0],
  [Robot.RIGHT]: [1, 0]
};

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let { output } = createMachine({
        id: 0,
        code: "day17"
      });
      const grid: string[][] = [];
      let rowIndex = 0;
      grid.push([]);
      const gen = output.generator();
      while (true) {
        const val = await gen.next();
        if (!val.done) {
          if (val.value === 10) {
            grid.push([]);
            rowIndex++;
          } else {
            grid[rowIndex].push(String.fromCharCode(val.value));
          }
        } else {
          break;
        }
      }

      const alignmentPoints: number[][] = [];

      for (let y = 1; y < grid.length - 1; y++) {
        for (let x = 1; x < grid.length - 1; x++) {
          if (
            grid[y][x] === "#" &&
            grid[y - 1][x] === "#" &&
            grid[y + 1][x] === "#" &&
            grid[y][x - 1] === "#" &&
            grid[y][x + 1] === "#"
          ) {
            alignmentPoints.push([x, y]);
          }
        }
      }
      // do alignment calculations
      resolve("Not Implemented");
    }, 1000);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let { output, input, debug } = createDebugMachine({
        id: 0,
        code: "day17"
      });

      debug.poke(0, 2);
      debug.run();

      const sequence: number[] = Array.from(
        "A,B,A,C,B,C,B,C,A,C\nL,10,R,12,R,12\nR,6,R,10,L,10\nR,10,L,10,L,12,R,6\nn\n"
      ).map(m => m.charCodeAt(0));

      for (const c of sequence) {
        input.addItem(c);
      }

      let str: string = "";
      while (true) {
        let val = await output.generator().next();
        if (!val.done) {
          if (val.value === 10) {
            console.log(str);
            str = "\n";
          } else if (val.value < 127) {
            str += String.fromCharCode(val.value);
          } else {
            resolve(val.value);
          }
        } else {
          throw new Error("ended without issuing output number");
        }
      }
      /*

      let { output } = createMachine({
        id: 0,
        code: "day17"
      });

      const grid: string[][] = [];
      let robotLocation: [number, number] = [Infinity, Infinity];
      let rowIndex = 0;
      grid.push([]);
      const gen = output.generator();
      while (true) {
        const val = await gen.next();
        if (!val.done) {
          if (val.value === 10) {
            grid.push([]);
            rowIndex++;
          } else {
            if (
              val.value === Robot.UP ||
              val.value === Robot.DOWN ||
              val.value === Robot.LEFT ||
              val.value === Robot.RIGHT
            ) {
              robotLocation = [grid[rowIndex].length, rowIndex];
              grid[rowIndex].push(String.fromCharCode(val.value));
            } else if (val.value === Robot.FALLING) {
              robotLocation = [grid[rowIndex].length, rowIndex];
              grid[rowIndex].push(String.fromCharCode(val.value));
              //grid[rowIndex].push("X");
            } else {
              grid[rowIndex].push(String.fromCharCode(val.value));
            }
          }
        } else {
          break;
        }
      }

      debugger;

      let r = (coord: Vector2d) => {
        if (grid[coord[1]] && grid[coord[1]][coord[0]] !== undefined)
          return grid[coord[1]][coord[0]];
        return ".";
      };
      let initialDir: Robot = r(robotLocation).charCodeAt(0);

      let done = false;
      let pos = robotLocation;
      let dir = initialDir;

      let path: string = "";
      do {
        let v: Vector2d = [0, 0];
        let c = "";
        let n: Robot = Robot.FALLING;
        let steps = 0;
        if (dir === Robot.UP) {
          if (r([pos[0] - 1, pos[1]]) === "#") {
            c = "L";
            v = directionVectors[Robot.LEFT];
            n = Robot.LEFT;
          } else if (r([pos[0] + 1, pos[1]]) === "#") {
            c = "R";
            v = directionVectors[Robot.RIGHT];
            n = Robot.RIGHT;
          }
        } else if (dir === Robot.DOWN) {
          if (r([pos[0] - 1, pos[1]]) === "#") {
            c = "R";
            v = directionVectors[Robot.LEFT];
            n = Robot.LEFT;
          } else if (r([pos[0] + 1, pos[1]]) === "#") {
            c = "L";
            v = directionVectors[Robot.RIGHT];
            n = Robot.RIGHT;
          } else {
            done = true;
            break;
          }
        } else if (dir === Robot.LEFT) {
          if (r([pos[0], pos[1] - 1]) === "#") {
            c = "R";
            v = directionVectors[Robot.UP];
            n = Robot.UP;
          } else if (r([pos[0], pos[1] + 1]) === "#") {
            c = "L";
            v = directionVectors[Robot.DOWN];
            n = Robot.DOWN;
          }
        } else if (dir === Robot.RIGHT) {
          if (r([pos[0], pos[1] - 1]) === "#") {
            c = "L";
            v = directionVectors[Robot.UP];
            n = Robot.UP;
          } else if (r([pos[0], pos[1] + 1]) === "#") {
            c = "R";
            v = directionVectors[Robot.DOWN];
            n = Robot.DOWN;
          }
        }
        if (!done) {
          do {
            steps++;
            pos = add(pos, v);
          } while (r(add(pos, v)) !== ".");
          path += `${c},${steps},`;
          dir = n;
        }
      } while (!done);

      console.log(path);

      resolve("Not Implemented");
      */
    }, 1000);
  });
};

export default runner;
