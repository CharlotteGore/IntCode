import source from "./input";
import tests from "./tests";
import { toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { Vector2d } from "../../Helpers/vector";

const runner: TestFunction = (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = starOne(input, params);
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    const testCases = tests[2];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = starTwo(input, params);
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

type Coord = number;
type Distance = number;
type Direction = number;

type Line = [Coord, Coord, Coord, Coord, Distance, Direction];

const inputToLines = (input: string) => {
  const lines = toLines(input).map(m =>
    m
      .split(/,/g)
      .map(m => m.match(/(U|R|D|L)(\d+)/))
      .reduce((lines: Array<Line>, line, index, array) => {
        if (line !== null) {
          let v: Line = [0, 0, 0, 0, 0, 0];
          if (index > 0) {
            let prev = lines[index - 1];
            // this lines starts from where the last
            // line ended...
            v[0] = prev[2];
            v[1] = prev[3];
            // distance is to the beginning of this line, not the end...
            v[4] =
              prev[4] +
              Math.abs(prev[2] - prev[0]) +
              Math.abs(prev[3] - prev[1]);
          }
          // with the direction and size
          // and the 'from' position calculated
          // we can compute the 'to' coordinate.
          // eslint-disable-next-line
          let [_, d, m] = line;
          let x = 0;
          let y = 0;
          let l = parseInt(m, 10);
          if (d === "U") {
            y = 1;
          } else if (d === "D") {
            y = -1;
          } else if (d === "L") {
            x = -1;
          } else {
            x = 1;
          }
          v[2] = v[0] + l * x;
          v[3] = v[1] + l * y;
          v[5] = x * 10 + y;
          lines.push(v);
        }
        return lines;
      }, [])
  );

  return lines;
};

const linesIntersect = (v1: Line, v2: Line): [number, number] | null => {
  let a = v1;
  let b = v2;
  if (Math.abs(v1[5]) === Math.abs(v2[5])) return null;

  // for easier math we ensure that operand a is always a vertical line.
  if (Math.abs(v1[5]) === 10) {
    a = v2;
    b = v1;
  }
  if (a[0] > Math.min(b[0], b[2]) && a[0] < Math.max(b[0], b[2])) {
    if (b[1] > Math.min(a[1], a[3]) && b[1] < Math.max(a[1], a[3])) {
      return [a[0], b[1]];
    }
  }
  return null;
};

const lineIntersectsPoint = (a: Line, p: Vector2d): boolean => {
  if (Math.abs(a[5]) === 1) {
    // vertical line
    if (a[0] === p[0]) {
      // one the same vertical plane...
      if (p[1] > Math.min(a[1], a[3]) && p[1] < Math.max(a[1], a[3])) {
        // intersects with point...
        return true;
      }
    }
  } else {
    // horizontal line
    if (a[1] === p[1]) {
      // one the same horizontal plane...
      if (p[0] > Math.min(a[0], a[2]) && p[0] < Math.max(a[0], a[2])) {
        return true;
      }
    }
  }
  return false;
};

const distanceToIntersection = (a: Line, p: Vector2d): number => {
  if (Math.abs(a[5]) === 1) {
    return a[4] + Math.abs(p[1] - a[1]);
  } else {
    return a[4] + Math.abs(p[0] - a[0]);
  }
};

const findCollisions = (lines: Array<Array<Line>>): Array<Vector2d> => {
  let collisions: Array<Vector2d> = [];
  for (let i = 0; i < lines[0].length; i++) {
    for (let j = 0; j < lines[1].length; j++) {
      let c = linesIntersect(lines[0][i], lines[1][j]);
      if (c !== null) collisions.push(c);
    }
  }
  return collisions;
};

const findDistanceToFirstCollision = (
  line: Array<Line>,
  v: Vector2d
): number => {
  for (let i = 0; i < line.length; i++) {
    let c = lineIntersectsPoint(line[i], v);
    if (c) return distanceToIntersection(line[i], v);
  }
  return Infinity;
};

const starOne = (input: string, params: Record<string, any>) => {
  let collisions = findCollisions(inputToLines(input));
  return collisions
    .map(m => Math.abs(m[0]) + Math.abs(m[1]))
    .sort((a, b) => a - b)[0]
    .toString();
};

const starTwo = (input: string, params: Record<string, any>) => {
  let lines = inputToLines(input);
  let collisions = findCollisions(lines);
  let distances = collisions
    .map((collision: Vector2d) => {
      let d1 = findDistanceToFirstCollision(lines[0], collision);
      let d2 = findDistanceToFirstCollision(lines[1], collision);
      return d1 + d2;
    })
    .sort((a, b) => a - b);
  return distances[0].toString();
};

export default runner;
