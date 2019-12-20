import source from "./input";

import { TestFunction } from "../hooks";
import { createMachine } from "../../IntcodeMachine/machine";

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

const starOne = (program: number[], params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let grid: number[] = [];
      let str = "";
      for (let y = 0; y < 50; y++) {
        for (let x = 0; x < 50; x++) {
          let {
            output: { generator },
            input
          } = createMachine({ program });
          let gen = generator();
          input.addItem(x);
          input.addItem(y);
          let val = await gen.next();
          if (!val.done) {
            grid[y * 50 + x] = val.value;
            if (val.value === 1) {
              str += "#";
            } else {
              str += ".";
            }
          }
          await gen.next();
        }
        str += "\n";
      }
      console.log(str);
      resolve(grid.reduce((sum, val) => sum + val, 0));
    }, 10);
  });
};

const testQuadrant = (
  x: number,
  y: number
): Promise<Record<string, boolean>> => {
  return new Promise(resolve => {
    const promises: Promise<[number, string]>[] = [];
    let corners: [number, number, string][] = [
      [0, 0, "bl"],
      [99, -99, "tr"]
    ];

    if (y - 99 < 0) {
      resolve({
        tr: false,
        bl: true
      });
      return;
    }

    corners.forEach(arr => {
      const xoff = arr[0];
      const yoff = arr[1];
      const quad = arr[2];
      promises.push(
        new Promise(resolve => {
          setTimeout(async () => {
            let {
              output: { generator },
              input
            } = createMachine({ code: "day19" });
            let gen = generator();
            input.addItem(x + xoff);
            input.addItem(y + yoff);
            let val = await gen.next();
            if (!val.done) {
              resolve([val.value, quad]);
            }
            gen.next();
          }, 0);
        })
      );
    });
    Promise.all(promises).then(values => {
      return resolve(
        values.reduce((data: Record<string, boolean>, value) => {
          data[value[1]] = value[0] === 1;
          return data;
        }, {})
      );
    });
  });
};

const getVal = (x: number, y: number): Promise<number> => {
  return new Promise(async resolve => {
    const { input, output } = createMachine({ program: source.input });
    let gen = output.generator();
    input.addItem(x);
    input.addItem(y);
    let val = await gen.next();
    if (!val.done) {
      resolve(val.value);
      gen.next();
    }
  });
};

declare global {
  interface Window {
    t: any;
    d: any;
  }
}

const starTwo = (input: number[], params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let x = 42;
      let y = 47;
      let iter = 0;
      while (true) {
        let next = await getVal(x, y + 1);
        if (next === 1) {
          y = y + 1;
        } else {
          x = x + 1;
          y = y + 1;
        }
        let result = await getVal(x + 99, y - 99);
        if (result) {
          console.log(`bl === ${x} x ${y}`, `tl === ${x} x ${y - 99}`);
          resolve(x * 10000 + (y - 99));
          return;
        }
        iter++;
        if (iter % 50 === 0) console.log("iterations", iter, `${x}x${y}`);
      }
    }, 10);
  });
};

export default runner;
