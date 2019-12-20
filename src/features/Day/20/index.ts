import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import { distance } from "../../Helpers/vector";

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

const OPEN = Symbol(".");
const WALL = Symbol("#");
const SPACE = Symbol(" ");
const WUT = Symbol("?");

const labelLookup = new Map<string, Symbol>();
const gateLookup = new Map<
  Symbol,
  {
    a: Symbol;
    b: Symbol;
  }
>();
const positionLookup = new Map<Symbol, number[]>();
const outs = new Map<Symbol, Symbol>();
const outerLabels: Symbol[] = [];
const innerLabels: Symbol[] = [];

type Trie = Record<number, Record<number, Record<number, number>>>;

const trie: Trie = {};

function findGaps(
  grid: (string | Symbol)[][],
  start: number[],
  direction: number[],
  length: number
): number[][] {
  let steps = 0;
  let x = start[0];
  let y = start[1];
  let gaps: number[][] = [];
  while (steps < length + 1) {
    if (grid[y][x] === OPEN) {
      gaps.push([x, y]);
    }
    x = x + direction[0];
    y = y + direction[1];
    steps++;
  }
  return gaps;
}

const starOne = (
  input: {
    ascii: string[][];
    inner: number[][];
    outer: number[][];
  },
  params: Record<string, any>
) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const {
        inner: [innerPos, innerSize],
        outer: [outerPos, outerSize],
        ascii
      } = input;

      const gr = ascii.map(m =>
        m.map((m): Symbol | string => {
          if (m === " ") return SPACE;
          if (m === ".") return OPEN;
          if (m === "#") return WALL;
          return m;
        })
      );

      const dealWithLabels = (
        label: string,
        x: number,
        y: number,
        level: string
      ) => {
        if (label === "AA" || label === "ZZ") {
          let labelSym = Symbol(label);
          labelLookup.set(label, labelSym);
          positionLookup.set(labelSym, [x, y]);
          gr[y][x] = labelSym;
          return;
        }

        let gateLabel = Symbol(label + level);
        gr[y][x] = gateLabel;

        if (level === "_inner") {
          innerLabels.push(gateLabel);
        } else {
          outerLabels.push(gateLabel);
        }

        positionLookup.set(gateLabel, [x, y]);

        if (labelLookup.get(label)) {
          // second time we've seen this label
          let labelSym = labelLookup.get(label) as Symbol;

          let gate = gateLookup.get(labelSym);
          if (gate !== undefined) {
            gate.b = gateLabel;
            outs.set(gate.a, gate.b);
            outs.set(gate.b, gate.a);
            gateLookup.set(labelSym, gate);
          }
        } else {
          // first time we've seen this label
          let labelSym = Symbol(label);
          labelLookup.set(label, labelSym);
          gateLookup.set(labelSym, {
            a: gateLabel,
            b: WUT
          });
        }
      };

      // outer north
      let gaps = findGaps(gr, outerPos, [1, 0], outerSize[0]);
      for (let [x, y] of gaps) {
        let label = (gr[y - 2][x] as string) + (gr[y - 1][x] as string);
        gr[y - 2][x] = SPACE;
        gr[y - 1][x] = SPACE;
        dealWithLabels(label, x, y, "_outer");
      }

      // outer south
      gaps = findGaps(
        gr,
        [outerPos[0], outerPos[1] + outerSize[1]],
        [1, 0],
        outerSize[0]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y + 1][x] as string) + (gr[y + 2][x] as string);
        gr[y + 1][x] = SPACE;
        gr[y + 2][x] = SPACE;

        dealWithLabels(label, x, y, "_outer");
      }

      // outer west
      gaps = findGaps(gr, outerPos, [0, 1], outerSize[1]);
      for (let [x, y] of gaps) {
        let label = (gr[y][x - 2] as string) + (gr[y][x - 1] as string);
        gr[y][x - 2] = SPACE;
        gr[y][x - 1] = SPACE;

        dealWithLabels(label, x, y, "_outer");
      }

      // outer east
      gaps = findGaps(
        gr,
        [outerPos[0] + outerSize[0], outerPos[1]],
        [0, 1],
        outerSize[1]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y][x + 1] as string) + (gr[y][x + 2] as string);
        gr[y][x + 1] = SPACE;
        gr[y][x + 2] = SPACE;

        dealWithLabels(label, x, y, "_outer");
      }
      // inner north
      gaps = findGaps(gr, innerPos, [1, 0], innerSize[0]);
      for (let [x, y] of gaps) {
        let label = (gr[y + 1][x] as string) + (gr[y + 2][x] as string);
        gr[y + 1][x] = SPACE;
        gr[y + 2][x] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      // inner south
      gaps = findGaps(
        gr,
        [innerPos[0], innerPos[1] + innerSize[1]],
        [1, 0],
        innerSize[0]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y - 2][x] as string) + (gr[y - 1][x] as string);
        gr[y - 2][x] = SPACE;
        gr[y - 1][x] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      // inner west
      gaps = findGaps(gr, innerPos, [0, 1], innerSize[1]);
      for (let [x, y] of gaps) {
        let label = (gr[y][x + 1] as string) + (gr[y][x + 2] as string);
        gr[y][x + 1] = SPACE;
        gr[y][x + 2] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      // inner east
      gaps = findGaps(
        gr,
        [innerPos[0] + innerSize[0], innerPos[1]],
        [0, 1],
        innerSize[1]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y][x - 2] as string) + (gr[y][x - 1] as string);
        gr[y][x - 2] = SPACE;
        gr[y][x - 1] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      const precomputePath = (
        start: number[],
        target: number[],
        gr: Symbol[][]
      ) => {
        debugger;
        const q: [number, number, number, Symbol][] = [
          [start[0], start[1], 0, gr[start[1]][start[0]]]
        ];
        let i = 0;
        let found = false;
        while (q[i] && !found) {
          let n = q[i];
          let c = n[2] + 1;
          let items: [number, number, number, Symbol][] = [];
          let x = n[0];
          let y = n[1];

          // process this step:
          let val = gr[n[1]][n[0]];
          if (outs.get(val)) {
            let next = positionLookup.get(outs.get(val)!);
            if (next) {
              items.push([next[0], next[1], c, outs.get(val)!]);
            } else {
              console.warn(`no next for ${val}`);
            }
          }

          // process the surrounding areas
          [
            [-1, 0],
            [+1, 0],
            [0, -1],
            [0, +1]
            // eslint-disable-next-line no-loop-func
          ].forEach(n => {
            let val = gr[y + n[1]][x + n[0]];
            if (x + n[0] === target[0] && y + n[1] === target[1]) {
              found = true;
              items.push([x + n[0], y + n[1], c, val]);
            } else if (val === OPEN) {
              items.push([x + n[0], y + n[1], c, val]);
            } else if (positionLookup.get(val)) {
              items.push([x + n[0], y + n[1], c, val]);
            }
          });
          items.forEach(n => {
            if (!q.find(m => m[0] === n[0] && m[1] === n[1] && m[2] <= c)) {
              q.push(n);
            }
          });
          i++;
        }
        if (found) {
          debugger;
          let path: [number, number, number, Symbol][] = [];
          let first: [number, number, number, Symbol] | undefined = q.find(
            m => m[0] === target[0] && m[1] === target[1]
          );
          if (first !== undefined) {
            let done = false;
            let current = first;
            while (!done) {
              let next = q
                // eslint-disable-next-line no-loop-func
                .filter(m => m[2] === current[2] - 1)
                .find(
                  // eslint-disable-next-line no-loop-func
                  m => {
                    if (distance([m[0], m[1]], [current[0], current[1]]) === 1)
                      return true;
                    if (outs.get(m[3]) === current[3]) return true;
                    return false;
                  }
                );
              if (!next) {
                console.warn(
                  "Somehow couldnt find the next node in the chain. Agh"
                );
                done = true;
                continue;
              }
              path.push([next[0], next[1], next[2], next[3]]);
              current = next;
              if (current[0] === start[0] && next[1] === start[1]) {
                done = true;
                continue;
              }
            }
            return path.reverse();
          } else {
            console.warn(
              "How exactly did THAT happen? Found, but cant find target in queue"
            );
            return [];
          }
        } else {
          console.warn("No path found");
          return [];
        }
      };

      let processed = gr as Symbol[][];

      //for (const [syma, posa] of positionLookup) {
      //  for (const [symb, posb] of positionLookup) {
      //   if (syma !== symb) {
      let result = precomputePath(
        positionLookup.get(labelLookup.get("AA")!)!,
        positionLookup.get(labelLookup.get("ZZ")!)!,
        processed
      );

      resolve(result.length);
    }, 10);
  });
};

const starTwo = (
  input: {
    ascii: string[][];
    inner: number[][];
    outer: number[][];
  },
  params: Record<string, any>
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const {
        inner: [innerPos, innerSize],
        outer: [outerPos, outerSize],
        ascii
      } = input;

      const st = performance.now();

      const gr = ascii.map(m =>
        m.map((m): Symbol | string => {
          if (m === " ") return SPACE;
          if (m === ".") return OPEN;
          if (m === "#") return WALL;
          return m;
        })
      );

      const dealWithLabels = (
        label: string,
        x: number,
        y: number,
        level: string
      ) => {
        if (label === "AA" || label === "ZZ") {
          let labelSym = Symbol(label);
          labelLookup.set(label, labelSym);
          positionLookup.set(labelSym, [x, y]);
          gr[y][x] = labelSym;
          return;
        }

        let gateLabel = Symbol(label + level);
        gr[y][x] = gateLabel;

        if (level === "_inner") {
          innerLabels.push(gateLabel);
        } else {
          outerLabels.push(gateLabel);
        }

        positionLookup.set(gateLabel, [x, y]);

        if (labelLookup.get(label)) {
          // second time we've seen this label
          let labelSym = labelLookup.get(label) as Symbol;

          let gate = gateLookup.get(labelSym);
          if (gate !== undefined) {
            gate.b = gateLabel;
            outs.set(gate.a, gate.b);
            outs.set(gate.b, gate.a);
            gateLookup.set(labelSym, gate);
          }
        } else {
          // first time we've seen this label
          let labelSym = Symbol(label);
          labelLookup.set(label, labelSym);
          gateLookup.set(labelSym, {
            a: gateLabel,
            b: WUT
          });
        }
      };

      // outer north
      let gaps = findGaps(gr, outerPos, [1, 0], outerSize[0]);
      for (let [x, y] of gaps) {
        let label = (gr[y - 2][x] as string) + (gr[y - 1][x] as string);
        gr[y - 2][x] = SPACE;
        gr[y - 1][x] = SPACE;
        dealWithLabels(label, x, y, "_outer");
      }

      // outer south
      gaps = findGaps(
        gr,
        [outerPos[0], outerPos[1] + outerSize[1]],
        [1, 0],
        outerSize[0]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y + 1][x] as string) + (gr[y + 2][x] as string);
        gr[y + 1][x] = SPACE;
        gr[y + 2][x] = SPACE;

        dealWithLabels(label, x, y, "_outer");
      }

      // outer west
      gaps = findGaps(gr, outerPos, [0, 1], outerSize[1]);
      for (let [x, y] of gaps) {
        let label = (gr[y][x - 2] as string) + (gr[y][x - 1] as string);
        gr[y][x - 2] = SPACE;
        gr[y][x - 1] = SPACE;

        dealWithLabels(label, x, y, "_outer");
      }

      // outer east
      gaps = findGaps(
        gr,
        [outerPos[0] + outerSize[0], outerPos[1]],
        [0, 1],
        outerSize[1]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y][x + 1] as string) + (gr[y][x + 2] as string);
        gr[y][x + 1] = SPACE;
        gr[y][x + 2] = SPACE;

        dealWithLabels(label, x, y, "_outer");
      }
      // inner north
      gaps = findGaps(gr, innerPos, [1, 0], innerSize[0]);
      for (let [x, y] of gaps) {
        let label = (gr[y + 1][x] as string) + (gr[y + 2][x] as string);
        gr[y + 1][x] = SPACE;
        gr[y + 2][x] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      // inner south
      gaps = findGaps(
        gr,
        [innerPos[0], innerPos[1] + innerSize[1]],
        [1, 0],
        innerSize[0]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y - 2][x] as string) + (gr[y - 1][x] as string);
        gr[y - 2][x] = SPACE;
        gr[y - 1][x] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      // inner west
      gaps = findGaps(gr, innerPos, [0, 1], innerSize[1]);
      for (let [x, y] of gaps) {
        let label = (gr[y][x + 1] as string) + (gr[y][x + 2] as string);
        gr[y][x + 1] = SPACE;
        gr[y][x + 2] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      // inner east
      gaps = findGaps(
        gr,
        [innerPos[0] + innerSize[0], innerPos[1]],
        [0, 1],
        innerSize[1]
      );
      for (let [x, y] of gaps) {
        let label = (gr[y][x - 2] as string) + (gr[y][x - 1] as string);
        gr[y][x - 2] = SPACE;
        gr[y][x - 1] = SPACE;

        dealWithLabels(label, x, y, "_inner");
      }

      type X = number;
      type Y = number;
      type STEPS = number;
      type Z = number;

      type QueueItem = [X, Y, Z, STEPS, Symbol];

      const precomputePath = (
        start: number[],
        target: number[],
        gr: Symbol[][]
      ) => {
        const q: QueueItem[] = [
          [start[0], start[1], 0, 0, gr[start[1]][start[0]]]
        ];
        trie[start[0]] = {
          [start[1]]: {
            0: 0
          }
        };
        let found = false;
        while (q.length && !found) {
          let n = q[0];
          let c = n[3] + 1;
          let items: QueueItem[] = [];
          let x: X = n[0];
          let y: Y = n[1];
          let z: Z = n[2];

          // process this step:
          let val = gr[n[1]][n[0]];
          if (outerLabels.includes(val)) {
            if (z === 0) throw new Error("Outer Gate open on ground floor");
            let next = positionLookup.get(outs.get(val)!);
            if (next) {
              items.push([next[0], next[1], z - 1, c, val]);
            } else {
              console.warn(`no next for ${val}`);
            }
          } else if (innerLabels.includes(val)) {
            let next = positionLookup.get(outs.get(val)!);
            if (next) {
              items.push([next[0], next[1], z + 1, c, val]);
            } else {
              console.warn(`no next for ${val}`);
            }
          }

          // process the surrounding areas
          [
            [-1, 0],
            [+1, 0],
            [0, -1],
            [0, +1]
            // eslint-disable-next-line no-loop-func
          ].forEach(n => {
            let val = gr[y + n[1]][x + n[0]];
            if (
              z > 0 &&
              (val === labelLookup.get("AA") || val === labelLookup.get("ZZ"))
            ) {
              return;
            }
            if (z === 0 && x + n[0] === target[0] && y + n[1] === target[1]) {
              found = true;
              items.push([x + n[0], y + n[1], z, c, val]);
            } else if (val === OPEN) {
              items.push([x + n[0], y + n[1], z, c, val]);
            } else if (
              (z > 0 && outerLabels.includes(val)) ||
              innerLabels.includes(val)
            ) {
              items.push([x + n[0], y + n[1], z, c, val]);
            }
          });
          items.forEach(n => {
            if (trie[n[0]]) {
              if (trie[n[0]][n[1]]) {
                if (trie[n[0]][n[1]][n[2]]) {
                  if (trie[n[0]][n[1]][n[2]] > n[3]) {
                    q.push(n);
                    trie[n[0]][n[1]][n[2]] = n[3];
                  }
                } else {
                  q.push(n);
                  trie[n[0]][n[1]][n[2]] = n[3];
                }
              } else {
                q.push(n);
                trie[n[0]][n[1]] = {
                  [n[2]]: n[3]
                };
              }
            } else {
              q.push(n);
              trie[n[0]] = {
                [n[1]]: {
                  [n[2]]: n[3]
                }
              };
            }
          });
          q.splice(0, 1);
        }
        if (found) {
          return q;
        } else {
          return [];
        }
      };

      let processed = gr as Symbol[][];

      console.log(performance.now() - st);
      //for (const [syma, posa] of positionLookup) {
      //  for (const [symb, posb] of positionLookup) {
      //   if (syma !== symb) {
      let s = performance.now();
      let result = precomputePath(
        positionLookup.get(labelLookup.get("AA")!)!,
        positionLookup.get(labelLookup.get("ZZ")!)!,
        processed
      );
      console.log(performance.now() - s);
      resolve(result[result.length - 1][3]);
    }, 10);
  });
};

export default runner;
