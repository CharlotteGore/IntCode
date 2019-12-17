/* eslint no-loop-func: "off" */
import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import { createMachine } from "../../IntcodeMachine/machine";
import { Vector2d, add, distance } from "../../Helpers/vector";

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

const getGridExtents = (
  grid: Record<number, Record<number, CELLS>>
): { l: number; r: number; t: number; b: number } =>
  Object.keys(grid).reduce(
    (e, xkey) => {
      let x = parseInt(xkey);
      if (x < e.l) e.l = x;
      if (x > e.r) e.r = x;
      return Object.keys(grid[x]).reduce((e, ykey) => {
        let y = parseInt(ykey);
        if (y > e.b) e.b = y;
        if (y < e.t) e.t = y;
        return e;
      }, e);
    },
    { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity }
  );

/*
north (1), south (2), west (3), and east (4)
*/

/*
What is the fewest number of movement commands required to move the repair droid from its starting position to the location of the oxygen system?
*/

enum DIRECTIONS {
  NORTH = 1,
  SOUTH = 2,
  WEST = 3,
  EAST = 4
}

enum CODES {
  WALL = 0,
  MOVED = 1,
  FOUND_OXYGEN = 2
}

enum CELLS {
  SPACE = 0,
  WALL = 1,
  OXYGEN = 2
}

const oppositeDirection = {
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.WEST]: DIRECTIONS.EAST,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST
};

const directionVectors: Record<DIRECTIONS, Vector2d> = {
  [DIRECTIONS.NORTH]: [0, -1],
  [DIRECTIONS.SOUTH]: [0, 1],
  [DIRECTIONS.WEST]: [-1, 0],
  [DIRECTIONS.EAST]: [1, 0]
};

const exploring = [
  DIRECTIONS.NORTH,
  DIRECTIONS.EAST,
  DIRECTIONS.SOUTH,
  DIRECTIONS.WEST
];

/*
0: The repair droid hit a wall. Its position has not changed.
1: The repair droid has moved one step in the requested direction.
2: The repair droid has moved one step in the requested direction; its new position is the location of the oxygen system.
*/

const render = (
  grid: Record<number, Record<number, CELLS>>,
  view: { w: number; h: number; xoff: number; yoff: number },
  pos?: Vector2d
) => {
  let str = "";
  let html = document.getElementById("out");
  if (!html) {
    html = document.createElement("pre");
    html.id = "out";
    document.body.appendChild(html);
  }
  for (let y = 0; y < view.h; y++) {
    for (let x = 0; x < view.w; x++) {
      if (pos && pos[0] === view.xoff + x && pos[1] === view.yoff + y) {
        str += "@";
      } else {
        if (
          grid[view.xoff + x] &&
          grid[view.xoff + x][view.yoff + y] !== undefined
        ) {
          let val = grid[view.xoff + x][view.yoff + y];
          if (val === CELLS.WALL) {
            str += "#";
          } else if (val === CELLS.OXYGEN) {
            str += "o";
          } else {
            str += ".";
          }
        } else {
          str += " ";
        }
      }
    }
    str += "\n";
  }
  html.innerHTML = str;
};

const starOne = (
  input: string,
  params: Record<string, any>
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let { output, input } = createMachine({
        id: 0,
        code: "day15"
      });

      let grid: Record<number, Record<number, CELLS>> = { 0: { 0: 0 } };
      let pos: Vector2d = [0, 0];
      let steps = 0;

      let queue: Array<[number, number, number]> = [[0, 0, 0]];
      let queueIndex = 0;
      let c = 0;
      let oxygenFound: Vector2d | null = null;

      let view = { w: 41, h: 41, xoff: -21, yoff: -21 };

      const r = () => {
        render(grid, view, pos);
      };

      let interval = setInterval(r, 10);

      const explore = async (
        c: number
      ): Promise<[number, number, number][]> => {
        let items: [number, number, number][] = [];
        c++;
        for (const dir of exploring) {
          let willBeAt = add(pos, directionVectors[dir]);
          if (
            grid[willBeAt[0]] &&
            grid[willBeAt[0]][willBeAt[1]] !== undefined
          ) {
            continue;
          }
          setTimeout(() => {
            steps++;
            input.addItem(dir);
          });

          let code = await output.generator().next();
          if (code.value === CODES.MOVED || code.value === CODES.FOUND_OXYGEN) {
            pos = add(pos, directionVectors[dir]);

            items.push([pos[0], pos[1], c]);

            if (code.value === CODES.FOUND_OXYGEN) {
              oxygenFound = pos;
              // make a memo of the grid
              if (!grid[pos[0]]) {
                grid[pos[0]] = {};
              }
              grid[pos[0]][pos[1]] = CELLS.OXYGEN;
            } else {
              // make a memo of the grid
              if (!grid[pos[0]]) {
                grid[pos[0]] = {};
              }
              grid[pos[0]][pos[1]] = CELLS.SPACE;
            }

            // return to the starting location
            setTimeout(() => {
              steps++;
              input.addItem(oppositeDirection[dir]);
            }, 10);

            let result = await output.generator().next();
            if (!result.done) {
              pos = add(pos, directionVectors[oppositeDirection[dir]]);
              continue;
            } else {
              throw new Error("ROBOT MALFUNCTION");
            }
          } else {
            let wallPos = add(pos, directionVectors[dir]);
            if (!grid[wallPos[0]]) grid[wallPos[0]] = {};
            grid[wallPos[0]][wallPos[1]] = CELLS.WALL;
          }
        }
        return items;
      };

      const goTo = async (path: Array<Vector2d | [number, number, number]>) => {
        for (const nextStep of path) {
          if (nextStep[0] < pos[0]) {
            // we need to go WEST
            setTimeout(() => {
              steps++;
              input.addItem(DIRECTIONS.WEST);
            }, 10);

            pos = add(pos, directionVectors[DIRECTIONS.WEST]);
          } else if (nextStep[0] > pos[0]) {
            setTimeout(() => {
              steps++;
              input.addItem(DIRECTIONS.EAST);
            }, 10);

            pos = add(pos, directionVectors[DIRECTIONS.EAST]);
          } else if (nextStep[1] < pos[1]) {
            setTimeout(() => {
              steps++;
              input.addItem(DIRECTIONS.NORTH);
            }, 10);

            pos = add(pos, directionVectors[DIRECTIONS.NORTH]);
          } else if (nextStep[1] > pos[1]) {
            setTimeout(() => {
              steps++;
              input.addItem(DIRECTIONS.SOUTH);
            }, 10);
            pos = add(pos, directionVectors[DIRECTIONS.SOUTH]);
          }
          await output.generator().next();
        }
      };

      const findPathTo = (
        target: [number, number, number]
      ): [number, number][] => {
        const q = [[target[0], target[1], 0]];
        let i = 0;
        let targetFound = false;

        while (q[i] && !targetFound) {
          let items: [number, number, number][] = [];
          let p = q[i];
          let c = p[2] + 1;
          if (
            (grid[p[0]] && grid[p[0]][p[1] - 1] === CELLS.SPACE) ||
            (grid[p[0]] && grid[p[0]][p[1] - 1] === CELLS.OXYGEN)
          ) {
            items.push([p[0], p[1] - 1, c]);
          }
          if (
            (grid[p[0]] && grid[p[0]][p[1] + 1] === CELLS.SPACE) ||
            (grid[p[0]] && grid[p[0]][p[1] + 1] === CELLS.OXYGEN)
          ) {
            items.push([p[0], p[1] + 1, c]);
          }
          if (
            (grid[p[0] - 1] && grid[p[0] - 1][p[1]] === CELLS.SPACE) ||
            (grid[p[0] - 1] && grid[p[0] - 1][p[1]] === CELLS.OXYGEN)
          ) {
            items.push([p[0] - 1, p[1], c]);
          }
          if (
            (grid[p[0] + 1] && grid[p[0] + 1][p[1]] === CELLS.SPACE) ||
            (grid[p[0] + 1] && grid[p[0] + 1][p[1]] === CELLS.OXYGEN)
          ) {
            items.push([p[0] + 1, p[1], c]);
          }
          items.forEach(item => {
            if (item[0] === pos[0] && item[1] === pos[1]) {
              targetFound = true;
            }
            if (
              !q.find(m => m[0] === item[0] && m[1] === item[1] && m[2] <= c)
            ) {
              q.push(item);
            }
          });
          i++;
        }

        let path: [number, number][] = [];
        let start = q.find(m => m[0] === pos[0] && m[1] === pos[1]);
        if (start) {
          let done = false;
          let current = start;
          // path.push([start[0], start[1]]);
          while (!done) {
            let next = q.find(
              m =>
                m[2] === current[2] - 1 &&
                distance([m[0], m[1]], [current[0], current[1]]) === 1
            );
            if (next) {
              path.push([next[0], next[1]]);
              current = next;
              if (next[0] === target[0] && next[1] === target[1]) {
                done = true;
              }
            } else {
              throw new Error("Pathfinding error");
            }
          }
        }
        return path;
      };
      let cycles = 0;
      while (queue[queueIndex] && !oxygenFound) {
        // assuming we're at the correct position...
        let q = queue[queueIndex];
        if (pos[0] !== q[0] || pos[1] !== q[1]) {
          const path = findPathTo(queue[queueIndex]);
          if (path && path.length) {
            await goTo(path);
          } else {
            throw new Error("No path found");
          }
        }

        c = queue[queueIndex][2];
        let items = await explore(c);
        items.forEach(item => {
          // if the queue doesn't already have an item like this....
          if (
            !queue.find(
              m => m[0] === item[0] && m[1] === item[1] && m[2] <= item[2]
            )
          ) {
            queue.push(item);
          }
        });
        queue.splice(0, 1);
        queue.sort((a, b) => {
          var ad = distance(pos, [a[0], a[1]]);
          var bd = distance(pos, [b[0], b[1]]);
          return ad - bd;
        });
        cycles++;
      }

      pos = [0, 0];
      let result = [];
      if (oxygenFound) {
        result = findPathTo(oxygenFound);
        clearInterval(interval);
        resolve([result.length, cycles, steps]);
      } else {
        throw new Error("catastrofucked!");
      }
    }, 1000);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const startTime = performance.now();
      // const [_, oxygenLocation] = await starOne("", {});
      let { output, input } = createMachine({
        id: 0,
        code: "day15"
      });

      let pos: Vector2d = [0, 0];
      let grid: Record<number, Record<number, CELLS>> = {
        [pos[0]]: { [pos[1]]: CELLS.OXYGEN }
      };
      let queue: Array<[number, number, number]> = [[pos[0], pos[1], 0]];
      let queueIndex = 0;
      let c = 0;
      let oxygenFound: Vector2d | null = null;

      const explore = async (
        c: number
      ): Promise<[number, number, number][]> => {
        let items: [number, number, number][] = [];
        c++;
        for (const dir of exploring) {
          let willBeAt = add(pos, directionVectors[dir]);
          if (
            grid[willBeAt[0]] &&
            grid[willBeAt[0]][willBeAt[1]] !== undefined
          ) {
            continue;
          }
          input.addItem(dir);
          let code = await output.generator().next();
          if (code.value === CODES.MOVED || code.value === CODES.FOUND_OXYGEN) {
            pos = add(pos, directionVectors[dir]);

            items.push([pos[0], pos[1], c]);

            if (code.value === CODES.FOUND_OXYGEN) {
              // make a memo of the grid
              if (!grid[pos[0]]) {
                grid[pos[0]] = {};
              }
              grid[pos[0]][pos[1]] = CELLS.OXYGEN;
              oxygenFound = [pos[0], pos[1]];
            } else {
              // make a memo of the grid
              if (!grid[pos[0]]) {
                grid[pos[0]] = {};
              }
              grid[pos[0]][pos[1]] = CELLS.SPACE;
            }

            // return to the starting location
            input.addItem(oppositeDirection[dir]);
            let result = await output.generator().next();
            if (!result.done) {
              pos = add(pos, directionVectors[oppositeDirection[dir]]);
              continue;
            } else {
              throw new Error("ROBOT MALFUNCTION");
            }
          } else {
            let wallPos = add(pos, directionVectors[dir]);
            if (!grid[wallPos[0]]) grid[wallPos[0]] = {};
            grid[wallPos[0]][wallPos[1]] = CELLS.WALL;
          }
        }
        return items;
      };

      const goTo = async (path: Array<Vector2d | [number, number, number]>) => {
        for (const nextStep of path) {
          if (nextStep[0] < pos[0]) {
            // we need to go WEST
            input.addItem(DIRECTIONS.WEST);
            pos = add(pos, directionVectors[DIRECTIONS.WEST]);
          } else if (nextStep[0] > pos[0]) {
            input.addItem(DIRECTIONS.EAST);
            pos = add(pos, directionVectors[DIRECTIONS.EAST]);
          } else if (nextStep[1] < pos[1]) {
            input.addItem(DIRECTIONS.NORTH);
            pos = add(pos, directionVectors[DIRECTIONS.NORTH]);
          } else if (nextStep[1] > pos[1]) {
            input.addItem(DIRECTIONS.SOUTH);
            pos = add(pos, directionVectors[DIRECTIONS.SOUTH]);
          }
          await output.generator().next();
        }
      };

      const findPathTo = (
        target: [number, number, number]
      ): [number, number][] => {
        const q = [[target[0], target[1], 0]];
        let i = 0;
        let targetFound = false;

        while (q[i] && !targetFound) {
          let items: [number, number, number][] = [];
          let p = q[i];
          let c = p[2] + 1;
          if (
            (grid[p[0]] && grid[p[0]][p[1] - 1] === CELLS.SPACE) ||
            (grid[p[0]] && grid[p[0]][p[1] - 1] === CELLS.OXYGEN)
          ) {
            items.push([p[0], p[1] - 1, c]);
          }
          if (
            (grid[p[0]] && grid[p[0]][p[1] + 1] === CELLS.SPACE) ||
            (grid[p[0]] && grid[p[0]][p[1] + 1] === CELLS.OXYGEN)
          ) {
            items.push([p[0], p[1] + 1, c]);
          }
          if (
            (grid[p[0] - 1] && grid[p[0] - 1][p[1]] === CELLS.SPACE) ||
            (grid[p[0] - 1] && grid[p[0] - 1][p[1]] === CELLS.OXYGEN)
          ) {
            items.push([p[0] - 1, p[1], c]);
          }
          if (
            (grid[p[0] + 1] && grid[p[0] + 1][p[1]] === CELLS.SPACE) ||
            (grid[p[0] + 1] && grid[p[0] + 1][p[1]] === CELLS.OXYGEN)
          ) {
            items.push([p[0] + 1, p[1], c]);
          }
          items.forEach(item => {
            if (item[0] === pos[0] && item[1] === pos[1]) {
              targetFound = true;
            }
            if (
              !q.find(m => m[0] === item[0] && m[1] === item[1] && m[2] <= c)
            ) {
              q.push(item);
            }
          });
          i++;
        }

        let path: [number, number][] = [];
        let start = q.find(m => m[0] === pos[0] && m[1] === pos[1]);
        if (start) {
          let done = false;
          let current = start;
          // path.push([start[0], start[1]]);
          while (!done) {
            let next = q.find(
              m =>
                m[2] === current[2] - 1 &&
                distance([m[0], m[1]], [current[0], current[1]]) === 1
            );
            if (next) {
              path.push([next[0], next[1]]);
              current = next;
              if (next[0] === target[0] && next[1] === target[1]) {
                done = true;
              }
            } else {
              throw new Error("Pathfinding error");
            }
          }
        }
        return path;
      };
      while (queue[queueIndex]) {
        // assuming we're at the correct position...
        let q = queue[queueIndex];
        if (pos[0] !== q[0] || pos[1] !== q[1]) {
          const path = findPathTo(queue[queueIndex]);
          if (path && path.length) {
            await goTo(path);
          } else {
            throw new Error("No path found");
          }
        }

        c = queue[queueIndex][2];
        let items = await explore(c);
        items.forEach(item => {
          // if the queue doesn't already have an item like this....
          if (
            !queue.find(
              m => m[0] === item[0] && m[1] === item[1] && m[2] <= item[2]
            )
          ) {
            queue.push(item);
          }
        });

        queue.splice(0, 1);
        queue.sort((a, b) => {
          var ad = distance(pos, [a[0], a[1]]);
          var bd = distance(pos, [b[0], b[1]]);
          return ad - bd;
        });
      }

      // right at this point we've got the full grid. Time to do YET ANOTHER BFS.
      if (oxygenFound) {
        let q2: [number, number, number][] = [
          [oxygenFound[0], oxygenFound[1], 0]
        ];
        let qI = 0;
        while (q2[qI]) {
          let n = q2[qI];
          let c = n[2] + 1;
          let items: [number, number, number][] = [];
          if (grid[n[0]] && grid[n[0]][n[1] - 1] === CELLS.SPACE) {
            items.push([n[0], n[1] - 1, c]);
          }
          if (grid[n[0]] && grid[n[0]][n[1] + 1] === CELLS.SPACE) {
            items.push([n[0], n[1] + 1, c]);
          }
          if (grid[n[0] - 1] && grid[n[0] - 1][n[1]] === CELLS.SPACE) {
            items.push([n[0] - 1, n[1], c]);
          }
          if (grid[n[0] + 1] && grid[n[0] + 1][n[1]] === CELLS.SPACE) {
            items.push([n[0] + 1, n[1], c]);
          }
          items.forEach(item => {
            if (
              !q2.find(
                m => m[0] === item[0] && m[1] === item[1] && m[2] <= item[2]
              )
            ) {
              q2.push(item);
            }
          });
          qI++;
        }

        let extents = getGridExtents(grid);
        let view = {
          w: Math.abs(extents.r - extents.l) + 1,
          h: Math.abs(extents.b - extents.t) + 1,
          xoff: extents.l,
          yoff: extents.t
        };
        console.log(extents, view);
        render(grid, view);

        let d = 0;
        let interval = setInterval(() => {
          let next = q2.filter(m => m[2] === d);
          if (next && next.length) {
            for (let step of next) {
              grid[step[0]][step[1]] = CELLS.OXYGEN;
            }
            render(grid, view);
            d++;
          } else {
            clearInterval(interval);
          }
        }, 50);
        console.log(performance.now() - startTime);
        resolve(q2[q2.length - 1][2]);
      }

      //const path = findPathTo(queue[queue.length - 1]);

      resolve("fucked if i know");
    }, 1000);
  });
};

export default runner;
