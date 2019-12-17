import source from "./input";
import tests from "./tests";

import { TestFunction } from "../hooks";

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

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const d = [0, 1, 0, -1];
      let vi: number[] = Array.from(input).map(m => parseInt(m));

      for (let i = 0; i < 100; i++) {
        var vo: number[] = [];
        for (let k = 0; k < vi.length; k++) {
          let s = 0;
          for (let j = 0; j < vi.length; j++) {
            s =
              s + ((vi[j] * d[Math.floor((j + 1) / (k + 1)) % d.length]) % 10);
          }

          vo[k] = Math.abs(s % 10);
        }
        vi = vo;
      }
      resolve(vi.slice(0, 8).join(""));
    }, 1000);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let startTime = Date.now();
      const inBuffer = new ArrayBuffer(input.length * 10000);
      let vi = new Uint8Array(inBuffer);
      //let vo = new Uint8Array(outBuffer);
      let source: number[] = Array.from(input).map(m => parseInt(m));
      console.log("Generating real input");
      for (let i = 0; i < 10000 * source.length; i++) {
        vi[i] = source[i % source.length];
      }
      console.log("Output generated");

      let offset: number = parseInt(vi.slice(0, 7).join(""));

      console.log(`Offset key is ${offset}`);
      console.log(`start value is ${vi.slice(offset, offset + 8)}`);

      for (let i = 0; i < 100; i++) {
        //var vo: number[] = [];
        let val = vi[vi.length - 1];

        for (let k = vi.length - 2; k >= offset; k--) {
          let newVal = vi[k] + val;
          val = newVal;
          vi[k] = newVal % 10;
        }
      }

      console.log(`complete in ${(Date.now() - startTime) / 1000}s`);

      resolve(vi.slice(offset, offset + 8).join(""));
    }, 1000);
  });
};

export default runner;
