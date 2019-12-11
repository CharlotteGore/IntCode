import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";
import { normal, angleTo, distance } from "../../Helpers/vector";
import { toLines } from "../../Helpers/parsers";

const runner: TestFunction = (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = starOne(input, params, i);
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${starOne(input, params, -1)}`);

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

type star = [number, number];
type normal = [number, number];

const gridToStars = (input: string) => {
  const parsed = toLines(input).map(m => m.trim());
  return parsed.reduce((stars: Array<star>, line: string, y) => {
    stars = stars.concat(
      Array.from(line).reduce((stars: Array<star>, item: string, x) => {
        if (item === "#") stars.push([x, y]);
        return stars;
      }, [])
    );
    return stars;
  }, []);
};

const findBestStar = (stars: Array<star>) => {
  let max = -Infinity;
  let result: [number, number] = [0, -Infinity];
  for (let i = 0; i < stars.length; i++) {
    // for each star...
    const normals: Array<normal> = [];
    for (let j = 0; j < stars.length; j++) {
      if (i !== j) {
        // get the normal to every other star...
        const n = normal(stars[i], stars[j]);
        if (!normals.find(m => n[0] === m[0] && n[1] === m[1])) {
          normals.push(n);
        }
      }
    }
    if (normals.length > max) {
      max = normals.length;
      result = [max, i];
    }
  }
  return result;
};

const starOne = (input: string, _: Record<string, any>, testId: number) => {
  const stars = gridToStars(input);
  const [max, bestStarId] = findBestStar(stars);
  if (testId === -1) {
    console.log(
      "test one result",
      max,
      "best star",
      bestStarId,
      stars[bestStarId]
    );
  }
  return max.toString();
};

const starTwo = (input: string, params: Record<string, any>) => {
  const stars = gridToStars(input);
  // eslint-disable-next-line
  const [_, bestStar] = findBestStar(stars);

  const angleLookup = new Map<number, Array<[number, number, number]>>();
  for (let i = 0; i < stars.length; i++) {
    if (i !== bestStar) {
      const angle = angleTo(stars[bestStar], stars[i]);
      const angles = angleLookup.get(angle) || [];
      const dist = distance(stars[bestStar], stars[i]);
      angles.push([stars[i][0], stars[i][1], dist]);
      angleLookup.set(
        angle,
        angles.sort((a, b) => a[2] - b[2])
      );
    }
  }

  const sortedAngles = Array.from(angleLookup.keys()).sort((a, b) => a - b);

  let r = angleLookup.get(sortedAngles[199]);

  if (r && r.length) {
    return (r[0][0] * 100 + r[0][1]).toString();
  }
};

export default runner;
