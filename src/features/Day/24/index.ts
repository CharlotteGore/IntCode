import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";

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

const parseInput = (input: string): Uint8Array => {
  const arr = input
    .split(/\n/g)
    .map(m => m.trim())
    .reduce((arr: string[], m: string) => {
      return arr.concat(Array.from(m));
    }, [])
    .map((m: string): number => {
      if (m === ".") {
        return 0;
      } else {
        return 1;
      }
    });
  return new Uint8Array(arr);
};

const toBiodiversityRating = (grid: Uint8Array) => {
  let str: string = "";
  for (let i = grid.length - 1; i >= 0; i--) {
    str += grid[i];
  }
  return parseInt(str, 2);
};

const read = (grid: Uint8Array, x: number, y: number) => {
  if (x < 0 || x > 4 || y < 0 || y > 5) return 0;
  return grid[y * 5 + x];
};

const progressState = (grid: Uint8Array) => {
  // A bug dies (becoming an empty space)
  // unless there is exactly one bug adjacent to it.
  let newGrid = new Uint8Array(25);

  // An empty space becomes infested with a bug
  // if exactly one or two bugs are adjacent to it.
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      let alive = 0;
      if (read(grid, x, y - 1) === 1) alive++;
      if (read(grid, x, y + 1) === 1) alive++;
      if (read(grid, x - 1, y) === 1) alive++;
      if (read(grid, x + 1, y) === 1) alive++;

      if (read(grid, x, y) === 1) {
        if (alive === 1) {
          newGrid[y * 5 + x] = 1;
        } else {
          newGrid[y * 5 + x] = 0;
        }
      } else {
        if (alive === 1 || alive === 2) {
          newGrid[y * 5 + x] = 1;
        } else {
          newGrid[y * 5 + x] = 0;
        }
      }
    }
  }
  return newGrid;
};

let grids: Record<number, Uint8Array> = {};
let nextGrids: Record<number, Uint8Array> = {};

const makeNewLevel = () => new Uint8Array(25);

enum DIR {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
  NONE = 4
}

const readRecursive = (level: number, x: number, y: number, dir: DIR) => {
  if (x < 0 || x > 4 || y < 0 || y > 4) {
    // recurse to outer level (level -1);
    if (!grids[level - 1]) grids[level - 1] = makeNewLevel();
    let outerGrid = grids[level - 1];
    let r = read.bind(null, outerGrid);
    if (dir === DIR.UP) {
      return r(2, 1);
    } else if (dir === DIR.DOWN) {
      return r(2, 3);
    } else if (dir === DIR.LEFT) {
      return r(1, 2);
    } else if (dir === DIR.RIGHT) {
      return r(3, 2);
    }
    throw new Error("Invalid direction");
  } else if (x === 2 && y === 2) {
    // recurse to inner level (level +1);
    if (!grids[level + 1]) grids[level + 1] = makeNewLevel();
    let innerGrid = grids[level + 1];
    let r = read.bind(null, innerGrid);
    if (dir === DIR.UP) {
      return r(0, 4) + r(1, 4) + r(2, 4) + r(3, 4) + r(4, 4);
    } else if (dir === DIR.DOWN) {
      return r(0, 0) + r(1, 0) + r(2, 0) + r(3, 0) + r(4, 0);
    } else if (dir === DIR.LEFT) {
      return r(4, 0) + r(4, 1) + r(4, 2) + r(4, 3) + r(4, 4);
    } else if (dir === DIR.RIGHT) {
      return r(0, 0) + r(0, 1) + r(0, 2) + r(0, 3) + r(0, 4);
    }
    throw new Error("Invalid direction");
  } else {
    return grids[level][y * 5 + x];
  }
};

const progressStateRecursive = (level: number) => {
  // A bug dies (becoming an empty space)
  // unless there is exactly one bug adjacent to it.
  let newGrid = new Uint8Array(25);
  let r = readRecursive.bind(null, level);

  // An empty space becomes infested with a bug
  // if exactly one or two bugs are adjacent to it.
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (x === 2 && y === 2) continue;
      let alive: number = 0;
      alive += r(x, y - 1, DIR.UP);
      alive += r(x, y + 1, DIR.DOWN);
      alive += r(x - 1, y, DIR.LEFT);
      alive += r(x + 1, y, DIR.RIGHT);

      if (r(x, y, DIR.NONE) === 1) {
        if (alive === 1) {
          newGrid[y * 5 + x] = 1;
        } else {
          newGrid[y * 5 + x] = 0;
        }
      } else {
        if (alive === 1 || alive === 2) {
          newGrid[y * 5 + x] = 1;
        } else {
          newGrid[y * 5 + x] = 0;
        }
      }
    }
  }
  return newGrid;
};

const print = (grid: Uint8Array) => {
  let str = "";
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (x === 2 && y === 2) {
        str += "?";
        continue;
      }
      str += grid[y * 5 + x] === 1 ? "#" : ".";
    }
    str += "\n";
  }
  console.log(str);
  return str;
};

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let current: Uint8Array = parseInput(input);
      let next: Uint8Array = new Uint8Array(25);
      const ratings: Record<number, boolean> = {};
      let done: boolean = false;
      while (!done) {
        next = progressState(current);
        let rating = toBiodiversityRating(next);
        if (ratings[rating]) {
          done = true;
          resolve(rating);
        } else {
          ratings[rating] = true;
        }
        current = next;
        console.log(print(current));
      }
    }, 10);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      grids[0] = parseInput(input);
      for (let i = 0; i < 200; i++) {
        /*
          Initially all other levels are empty. 
          So, for pass one we need to do a recursiveProgress
          on level 1, then a recursiveProgress on the two new levels 
          created.
        */
        nextGrids[0] = progressStateRecursive(0);
        for (let j = 1; j < i + 2; j++) {
          nextGrids[-j] = progressStateRecursive(-j);
          nextGrids[j] = progressStateRecursive(j);
        }
        grids = nextGrids;
        nextGrids = {};
      }

      let sum = 0;
      for (const level of Object.keys(grids)) {
        sum += grids[parseInt(level, 10)].reduce(
          (s: number, v: number) => s + v,
          0
        );
      }
      resolve(sum);
      console.log(sum);

      console.log("Depth: -1");
      print(grids[-1]);
      console.log("Depth: 0");
      print(grids[0]);
      console.log("Depth: 1");
      print(grids[1]);
      //console.log("Depth: 2");
      //print(grids[2]);
      //console.log("Depth: 3");
      //print(grids[3]);
      //console.log("Depth: 4");
      //print(grids[4]);
      //console.log("Depth: 5");
      //print(grids[5]);
      //console.log(grids);
      //resolve("Not Implemented");
    }, 10);
  });
};

export default runner;
