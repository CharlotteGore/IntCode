import source from "./input";
import tests from "./tests";
import { toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";

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
      const result = starOne(input, params);
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

type Vein = [number, number, number, number];
type Extents = {
  t: number;
  b: number;
  l: number;
  r: number;
};

type View = {
  h: number;
  w: number;
  xoff: number;
  yoff: number;
};

const parseVeins = (input: string): Array<Vein> => {
  const rawLines = toLines(input);
  const veins: Array<Vein> = [];
  for (let line of rawLines) {
    let match = line.match(/(x|y)=(\d+),\s+(x|y)=(\d+)\.\.(\d+)/);
    if (match === null) throw new Error("Parsing error");
    if (match[1] === "x") {
      veins.push([
        parseInt(match[2], 10),
        parseInt(match[4], 10),
        parseInt(match[2], 10),
        parseInt(match[5], 10)
      ]);
    } else {
      veins.push([
        parseInt(match[4], 10),
        parseInt(match[2], 10),
        parseInt(match[5], 10),
        parseInt(match[2], 10)
      ]);
    }
  }
  return veins;
};

enum GridType {
  EMPTY = ".".charCodeAt(0),
  CLAY = "#".charCodeAt(0),
  WATER = "~".charCodeAt(0),
  RUNNING_WATER = "|".charCodeAt(0)
}

const computeExtents = (veins: Array<Vein>): Extents => {
  const extents = veins.reduce(
    (e, vein) => {
      if (vein[0] < e.l) e.l = vein[0];
      if (vein[2] > e.r) e.r = vein[2];
      if (vein[1] < e.t) e.t = vein[1];
      if (vein[3] > e.b) e.b = vein[3];
      return e;
    },
    {
      t: Infinity,
      b: -Infinity,
      l: Infinity,
      r: -Infinity
    }
  );
  extents.b++;
  extents.r++;
  return extents;
};

const generateView = (extents: Extents): View => {
  return {
    h: extents.b - extents.t,
    w: extents.r + 1 - extents.l,
    xoff: extents.l,
    yoff: extents.t
  };
};

const generateGrid = (veins: Array<Vein>, extents: Extents, view: View) => {
  const dataView = new Uint8Array(new ArrayBuffer(view.w * view.h));

  return {
    get: (x: number, y: number): GridType => {
      return dataView[(y - view.yoff) * view.w + (x - view.xoff)];
    },
    set: (x: number, y: number, value: GridType) => {
      dataView[(y - view.yoff) * view.w + (x - view.xoff)] = value;
    }
  };
};

const applyVein = (
  set: (x: number, y: number, value: GridType) => void,
  vein: Vein
) => {
  let l = Math.abs(vein[2] - vein[0]) + Math.abs(vein[3] - vein[1]);
  const xv = (vein[2] - vein[0]) / l;
  const yv = (vein[3] - vein[1]) / l;
  let x = vein[0];
  let y = vein[1];
  while (l > -1) {
    set(x, y, GridType.CLAY);
    x += xv;
    y += yv;
    l--;
  }
};

const render = (get: (x: number, y: number) => GridType, extents: Extents) => {
  let html = document.getElementById("out");
  if (!html) {
    html = document.createElement("pre");
    html.id = "out";
    document.body.appendChild(html);
  }

  let str = ``;
  for (let y = extents.t; y < extents.b; y++) {
    for (let x = extents.l; x < extents.r; x++) {
      let v = get(x, y);
      str += v ? String.fromCharCode(v) : ".";
    }
    str += "\n";
  }
  html.innerHTML = str;
};

const starOne = (input: string, params: Record<string, any>) => {
  const veins = parseVeins(input);
  const extents = computeExtents(veins);
  const view = generateView(extents);
  const { get, set } = generateGrid(veins, extents, view);
  const veinWriter = applyVein.bind(null, set);

  for (const vein of veins) {
    veinWriter(vein);
  }

  // const fallPoints: Array<Vector2d> = [];
  // const junctions: Array<Vector2d> = [];

  /*
    okay whenever we fall we eventually hit ground.
    when we hit ground we make a junction
    we then go left from the junction until we make another junction or hit clay
      - if we hit clay then that those spaces are marked with ~
      - if we hit a junction then those spaces are marked with |
    then go right from the first junction until we make another junction. 
      - if we hit clay then that those spaces are marked with ~
      - if we hit a junction then those spaces are marked with |
    then we go back to the first junction and move it upwards on grid space.
    we then see if it's possible to go left. there must be empty space to the left
    and ~ in each grid space below.

        
      
  */

  render(get, extents);
  return "Not yet implemented";
};

const starTwo = (input: string, params: Record<string, any>) => {
  return "Not Implemented";
};

export default runner;
