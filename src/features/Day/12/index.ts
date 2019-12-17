import source from "./input";
import tests from "./tests";

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

const applyVelocity = (moons: Array<Moon>) => {
  for (const [posa, vela] of moons) {
    for (const [posb] of moons) {
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

const updatePositions = (moons: Array<Moon>) => {
  for (const [pos, vel] of moons) {
    for (let i = 0; i < pos.length; i++) {
      pos[i] = pos[i] + vel[i];
    }
  }
};

const computeEnergy = (moons: Array<Moon>) => {
  let sum = 0;
  for (const [pos, vel] of moons) {
    sum =
      sum +
      (Math.abs(pos[0]) + Math.abs(pos[1]) + Math.abs(pos[2])) *
        (Math.abs(vel[0]) + Math.abs(vel[1]) + Math.abs(vel[2]));
  }
  return sum;
};

const starOne = async (input: string, params: Record<string, any>) => {
  const moons: Array<Moon> = input
    .split(/\n/g)
    .map(m => m.match(/<x=([\d-]+),\s+y=([\d-]+),\s+z=([\d-]+)>/))
    .map(m => {
      if (m !== null) {
        // eslint-disable-next-line
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
  }

  return computeEnergy(moons).toString();
};

const starTwo = async (input: string, params: Record<string, any>) => {
  const moons: Array<Moon> = input
    .split(/\n/g)
    .map(m => m.match(/<x=([\d-]+),\s+y=([\d-]+),\s+z=([\d-]+)>/))
    .map(m => {
      if (m !== null) {
        // eslint-disable-next-line
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

  do {
    applyVelocity(moons);
    updatePositions(moons);
    const xT = getTuple(0);
    const yT = getTuple(1);
    const zT = getTuple(2);
    steps++;
    if (!xLoop && xT === initialX) {
      xLoop = steps;
      console.log("x loop found!", steps);
    }
    if (!yLoop && yT === initialY) {
      yLoop = steps;
      console.log("y loop found!", steps);
    }
    if (!zLoop && zT === initialZ) {
      zLoop = steps;
      console.log("z loop found!", steps);
    }
  } while (!xLoop || !yLoop || !zLoop);

  return lcm(xLoop, lcm(yLoop, zLoop)).toString();
};

export default runner;
