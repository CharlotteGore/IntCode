import source from "./input";

import { TestFunction } from "../hooks";
import { binaryIntSearch } from "../../Helpers/mashers";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    /*
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
    */

    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    /*
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
    */

    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${await starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const parseNodes = (input: string) => {
  return input.split(/\n/g).map(m =>
    m.split(/=>/).map(m =>
      m
        .split(/,/g)
        .map(m => m.trim())
        .reduce((results: Array<[number, string]>, m) => {
          const match = m.match(/(\d+)\s+([A-Z]+)/);
          if (match !== null) {
            results.push([parseInt(match[1]), match[2]]);
          } else {
            console.error(m);
            throw new Error(`unparseable ${m}`);
          }
          return results;
        }, [])
    )
  );
};

type Node = {
  id: string;
  makes: number;
  requires: Record<string, number>;
};

const Node = ([makes, id]: [number, string]): Node => ({
  id,
  makes,
  requires: {}
});

const toNode = (
  requirements: [number, string][],
  product: [number, string],
  map: Map<string, Node>
) => {
  const out = Node(product);
  if (map.get(out.id)) {
    console.log(map.get(out.id), product);
    throw new Error(`Oh god we already have one use of ${out.id}`);
  } else {
    map.set(out.id, out);
  }

  for (const input of requirements) {
    out.requires[input[1]] = input[0];
  }
};

const computeOre = (map: Map<string, Node>, test: number) => {
  const fuel = map.get("FUEL");
  if (!fuel) {
    throw new Error("cant find fuel");
  }
  let requirements: [number, Node][] = [[test, fuel]];
  let i = 0;

  let ingredients: Record<string, number> = {};
  let surplus: Record<string, number> = {};

  while (requirements[i]) {
    let v = requirements[i];
    let n = v[1];
    let c = v[0];
    for (let key of Object.keys(n.requires)) {
      let vr = n.requires[key];
      let d = map.get(key);
      if (d !== undefined) {
        let needed = c * vr;
        if (!ingredients[d.id]) ingredients[d.id] = 0;
        if (surplus[d.id]) {
          // surplus = 10, needed = 5
          needed = Math.max(needed - surplus[d.id], 0); // needed = 0
          surplus[d.id] -= vr * c - needed; // 10 - 8 === 2. Used 2.
        }
        if (needed > 0) {
          let amountToGenerate = Math.ceil(needed / d.makes);
          if (!surplus[d.id]) {
            surplus[d.id] = 0;
          }
          surplus[d.id] += amountToGenerate * d.makes - needed;
          ingredients[d.id] += amountToGenerate;
          requirements.push([amountToGenerate, map.get(key) as Node]);
        }
      } else if (key === "ORE") {
        if (!ingredients.ORE) ingredients.ORE = 0;
        ingredients.ORE += vr * c;
      } else {
        throw new Error(requirements[i].toString());
      }
    }
    i++;
  }

  return ingredients.ORE;
};

declare global {
  interface Window {
    computeOre: (test: number) => number;
  }
}

const starOne = async (input: string, params: Record<string, any>) => {
  const parsed = parseNodes(input);

  const map = new Map<string, Node>();

  parsed.forEach((m: [number, string][][]) => {
    toNode(m[0], m[1][0], map);
  });

  return computeOre(map, 1);
};

const starTwo = async (input: string, params: Record<string, any>) => {
  const start = performance.now();
  const parsed = parseNodes(input);

  const map = new Map<string, Node>();

  parsed.forEach((m: [number, string][][]) => {
    toNode(m[0], m[1][0], map);
  });

  const calcOre = computeOre.bind(null, map);
  const result = binaryIntSearch(
    (value: number) => calcOre(value) < 1000000000000
  );
  console.log(performance.now() - start);
  return result;
};

export default runner;
