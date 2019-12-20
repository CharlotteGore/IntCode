import source from "./input";

import { TestFunction } from "../hooks";
import {
  createMachine,
  createDebugMachine
} from "../../IntcodeMachine/machine";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star two test...
    const { input, params } = source;
    output.push(`Actual result: ${await starTwo(input, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

enum Tile {
  EMPTY = 0,
  WALL = 1,
  BLOCK = 2,
  PADDLE = 3,
  BALL = 4
}

type Pixel = Tile;

const render = (arr: Array<number>) => {
  let html = document.getElementById("out");
  if (!html) {
    html = document.createElement("pre");
    html.id = "out";
    document.body.appendChild(html);
  }

  let str = ``;
  for (let y = 0; y < 23; y++) {
    for (let x = 0; x < 41; x++) {
      let v = arr[y * 41 + x];
      if (v === Tile.BLOCK) {
        str += "#";
      } else if (v === Tile.BALL) {
        str += "o";
      } else if (v === Tile.PADDLE) {
        str += "=";
      } else if (v === Tile.WALL) {
        str += "|";
      } else {
        str += ".";
      }
    }
    str += "\n";
  }
  html.innerHTML = str;
};

const starOne = async (input: string, params: Record<string, any>) => {
  let { output } = createMachine({
    id: 0,
    code: "day13"
  });

  const out = output.generator();

  let arr = new Array(24 * 41).fill(0);
  let i = 0;
  do {
    const x = await out.next();
    if (x.done) break;
    const y = await out.next();
    if (y.done) break;
    const z = await out.next();
    if (z.done) break;
    i = y.value * 41 + x.value;
    arr[i] = z.value;
  } while (true);

  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === Tile.BLOCK) {
      count++;
    }
  }

  render(arr);

  return count.toString();
};

const starTwo = (_: string, params: Record<string, any>) => {
  return new Promise(resolve => {
    setTimeout(async () => {
      let { input, output, debug } = createDebugMachine({
        id: 0,
        code: "day13"
      });

      const out = output.generator();

      debug.poke(0, 2);
      debug.run();

      let arr = new Array(24 * 41).fill(0);
      let i = 0;
      let score = 0;

      let paddle: number | null = null;
      let ball: number | null = null;

      const r = () => {
        render(arr);
        requestAnimationFrame(r);
      };
      requestAnimationFrame(r);

      do {
        const x = await out.next();
        if (x.done) break;
        const y = await out.next();
        if (y.done) break;
        const z = await out.next();
        if (z.done) break;
        if (x.value === -1 && y.value === 0) {
          score = z.value;
        } else {
          i = y.value * 41 + x.value;
          arr[i] = z.value;

          if (z.value === Tile.PADDLE) {
            paddle = x.value;
          }
          if (z.value === Tile.BALL) {
            ball = x.value;
          }
          if (paddle !== null && ball !== null) {
            if (paddle > ball) {
              setTimeout(() => input.addItem(-1), 5);
              paddle = null;
            } else if (paddle < ball) {
              setTimeout(() => input.addItem(1), 5);
              paddle = null;
            } else {
              setTimeout(() => input.addItem(0), 5);
            }
            ball = null;
          }
        }
      } while (true);

      resolve(score.toString());
    }, 10);
  });
};

export default runner;
