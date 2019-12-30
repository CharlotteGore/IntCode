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

enum Ops {
  CUT = 0,
  DINC = 1,
  REV = 2,
  NULL = 3
}

type Op = {
  op: Ops;
  param: bigint;
};

const toOperations = (input: string): Op[] =>
  input.split(/\n/).map(m => {
    m = m.trim();
    if (m === "deal into new stack") {
      return {
        op: Ops.REV,
        param: BigInt(0)
      };
    } else if (m.substr(0, 3) === "cut") {
      return {
        op: Ops.CUT,
        param: BigInt(parseInt(m.substr(4), 10))
      };
    } else if (m.substr(0, 4) === "deal") {
      return {
        op: Ops.DINC,
        param: BigInt(parseInt(m.substr(20), 10))
      };
    } else {
      return {
        op: Ops.NULL,
        param: BigInt(0)
      };
    }
  });

const mod = (a: bigint, b: bigint) => ((a % b) + b) % b;

type Shuffle = {
  add: bigint;
  multiply: bigint;
};

const combineShuffle = (opa: Shuffle, opb: Shuffle, size: bigint) => {
  /*
    combining two shuffles...
    multiply = multiplyA * multiplyB % size;
    add = addA * multiplyB + addB;
  */
  return {
    add: mod(opa.add * opb.multiply + opb.add, size),
    multiply: mod(opa.multiply * opb.multiply, size)
  };
};

const modularInverse = (v: bigint, d: bigint): bigint => {
  let x = BigInt(1);
  let y = BigInt(0);
  let od = d;
  while (v > 1) {
    let q = BigInt(~~(v / d));
    let r = v % d;
    v = d;
    d = r;

    let ny = x - q * y;
    x = y;
    y = ny;
  }
  return mod(x, od);
};

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let card = BigInt(2019);
      let size = BigInt(10007);

      let ops = toOperations(input);

      let add = BigInt(0);
      let multiply = BigInt(1);
      let minusOne = BigInt(-1);

      for (const { op, param } of ops) {
        switch (op) {
          case Ops.CUT:
            add = mod(add - param, size);
            break;
          case Ops.DINC:
            add = mod(add * param, size);
            multiply = mod(multiply * param, size);
            break;
          case Ops.REV:
            add = mod(add * minusOne - BigInt(1), size);
            multiply = mod(multiply * minusOne, size);
            break;
        }
      }

      console.log(
        `((${multiply} * ${card}) + ${add}) % ${size} = ${mod(
          card * multiply + add,
          size
        )}`
      );
      card = mod(card * multiply + add, size);

      debugger;

      resolve(card);
    }, 10);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let iterations = 101741582076661;
      let size = BigInt(119315717514047);

      let ops = toOperations(input);
      let add = BigInt(0);
      let multiply = BigInt(1);
      let minusOne = BigInt(-1);
      for (const { op, param } of ops) {
        switch (op) {
          case Ops.CUT:
            add = mod(add - param, size);
            break;
          case Ops.DINC:
            add = mod(add * param, size);
            multiply = mod(multiply * param, size);
            break;
          case Ops.REV:
            add = mod(add * minusOne - BigInt(1), size);
            multiply = mod(multiply * minusOne, size);
            break;
        }
      }

      let powers: Record<number, Shuffle> = {};

      powers[1] = {
        add,
        multiply
      };

      let current: Shuffle = powers[1];
      for (let i = 2; iterations > i; i *= 2) {
        powers[i] = combineShuffle(current, current, size);
        current = powers[i];
      }

      let result: Shuffle = {
        add: BigInt(0),
        multiply: BigInt(1)
      };

      let t = iterations;
      while (t > 0) {
        let pow = Math.pow(2, ~~Math.log2(t));
        result = combineShuffle(result, powers[pow], size);
        t -= pow;
      }

      console.log(`To find position of card after ${iterations} iterations in a deck of size ${size} is:
      ((${result.multiply} * x) + ${result.add}) % ${size}
      `);

      let theFuckingResult = mod(
        (BigInt(2020) - result.add) * modularInverse(result.multiply, size),
        size
      );

      resolve(theFuckingResult);
      // and honestly I still don't understand any of this.
    }, 1000);
  });
};

export default runner;
