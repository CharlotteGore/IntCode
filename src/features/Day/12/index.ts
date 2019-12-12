import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { lcm } from "../../Helpers/mashers";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = await starOne(input, params);
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
      const result = await starTwo(input, params);
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

type Vector3d = [number, number, number];

type Moon = [Vector3d, Vector3d];

type Vector8 = [number, number, number, number, number, number, number, number];

const applyVelocity = (moons: Array<Moon>) => {
  for (const [posa, vela] of moons) {
    for (const [posb, velb] of moons) {
      if (posa !== posb) {
        for (let i = 0; i < posa.length; i++) {
          if (posa[i] < posb[i]) {
            vela[i] = vela[i] + 1;
          } else if (posa[i] > posb[i]) {
            vela[i] = vela[i] - 1;
          }
        }
      }
    }
  }
};

const compare = (moonsa: Array<Moon>, moonsb: Array<Moon>) => {
  for (let i = 0; i < moonsa.length; i++) {
    let posa = moonsa[i][0];
    let vela = moonsa[i][1];
    let posb = moonsb[i][0];
    let velb = moonsb[i][1];
    if (posa[0] === posb[0]) {
      if (posa[1] === posb[1]) {
        if (posa[2] === posb[2]) {
          if (vela[0] === velb[0]) {
            if (vela[1] === velb[1]) {
              if (vela[2] === velb[2]) {
                continue;
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};

const updatePositions = (moons: Array<Moon>) => {
  for (const [pos, vel] of moons) {
    for (let i = 0; i < pos.length; i++) {
      pos[i] = pos[i] + vel[i];
    }
  }
};

const computeEnergy = (moons: Array<Moon>) => {
  /*
  Energy after 10 steps:
pot: 2 + 1 + 3 =  6;   kin: 3 + 2 + 1 = 6;   total:  6 * 6 = 36
pot: 1 + 8 + 0 =  9;   kin: 1 + 1 + 3 = 5;   total:  9 * 5 = 45
pot: 3 + 6 + 1 = 10;   kin: 3 + 2 + 3 = 8;   total: 10 * 8 = 80
pot: 2 + 0 + 4 =  6;   kin: 1 + 1 + 1 = 3;   total:  6 * 3 = 18
Sum of total energy: 36 + 45 + 80 + 18 = 179
*/
  let sum = 0;
  for (const [pos, vel] of moons) {
    sum =
      sum +
      (Math.abs(pos[0]) + Math.abs(pos[1]) + Math.abs(pos[2])) *
        (Math.abs(vel[0]) + Math.abs(vel[1]) + Math.abs(vel[2]));
  }
  return sum;
};

const print = (moons: Array<Moon>) => {
  let str = "";
  for (const [pos, vel] of moons) {
    str += `pos=<x=${pos[0]}, y=${pos[1]}, z=${pos[2]}> vel=<x=${vel[0]}, y=${vel[1]}, z=${vel[2]}>\n`;
  }
  console.log(str);
};

const starOne = async (input: string, params: Record<string, any>) => {
  debugger;
  const moons: Array<Moon> = input
    .split(/\n/g)
    .map(m => m.match(/<x=([\d-]+),\s+y=([\d-]+),\s+z=([\d-]+)>/))
    .map(m => {
      if (m !== null) {
        const [_, x, y, z] = m;
        return [
          [~~x, ~~y, ~~z],
          [0, 0, 0]
        ];
      } else {
        return [
          [0, 0, 0],
          [0, 0, 0]
        ];
      }
    });

  for (let i = 0; i < params.steps; i++) {
    applyVelocity(moons);
    updatePositions(moons);
    //console.log(computeEnergy(moons));
  }
  print(moons);

  return computeEnergy(moons).toString();
};

const starTwo = async (input: string, params: Record<string, any>) => {
  const moons: Array<Moon> = input
    .split(/\n/g)
    .map(m => m.match(/<x=([\d-]+),\s+y=([\d-]+),\s+z=([\d-]+)>/))
    .map(m => {
      if (m !== null) {
        const [_, x, y, z] = m;
        return [
          [~~x, ~~y, ~~z],
          [0, 0, 0]
        ];
      } else {
        return [
          [0, 0, 0],
          [0, 0, 0]
        ];
      }
    });

  const firstMoons: Array<Moon> = [];
  for (const [pos, vel] of moons) {
    firstMoons.push([
      [pos[0], pos[1], pos[2]],
      [vel[0], vel[1], vel[2]]
    ]);
  }

  let steps = 0;

  const getTuple = (i: number): string => {
    return [
      moons[0][0][i],
      moons[1][0][i],
      moons[2][0][i],
      moons[3][0][i],
      moons[0][1][i],
      moons[1][1][i],
      moons[2][1][i],
      moons[3][1][i]
    ].toString();
  };

  let initialX = getTuple(0);
  let initialY = getTuple(1);
  let initialZ = getTuple(2);

  let xLoop: number | null = null;
  let yLoop: number | null = null;
  let zLoop: number | null = null;

  debugger;

  do {
    applyVelocity(moons);
    updatePositions(moons);
    const xT = getTuple(0);
    const yT = getTuple(1);
    const zT = getTuple(2);
    steps++;
    if (!xLoop && xT === initialX) {
      xLoop = steps;
      console.log("x loop found!");
    }
    if (!yLoop && yT === initialY) {
      yLoop = steps;
      console.log("y loop found!");
    }
    if (!zLoop && zT === initialZ) {
      zLoop = steps;
      console.log("z loop found!");
    }
    if (steps % 1000 === 0) {
      console.log(steps);
    }
  } while (!xLoop || !yLoop || !zLoop);

  return lcm(xLoop, lcm(yLoop, zLoop)).toString();
};

export default runner;
