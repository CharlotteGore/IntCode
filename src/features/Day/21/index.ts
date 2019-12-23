import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { IntcodeProgram } from "../../IntcodeMachine/intcode-runner";
import { createMachine } from "../../IntcodeMachine/machine";
import { IntcodePipe } from "../../IntcodeMachine/input-generators/pipe";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = await starOne(input, params).toString();
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

type SpringDroid = {
  T: boolean;
  J: boolean;
  A: boolean; // read only. one tile away
  B: boolean; // read only. two tiles away
  C: boolean; // read only. three tiles away
  D: boolean; // read only. four tiles away
};

// Figure out if the initial state

/*
   ABCD JUMP?    A     B     C     D  
1 #...# TRUE | false false false true
2 #..## TRUE | false false true  true
3 #.#.# TRUE | false true  false true
4 #.### TRUE | false true  true  true
5 ##..# TRUE | true  false false false
6 ##.## FALS | true  false true  false
7 ###.# TRUE | true  true  false true
8 ##### FALS | true  true  true  false

(not A or not B or not C) and D

NOT A T
AND B T
AND C T
OR T J

T bli 1
T bli 0
T bli 0
J bli 0.

NO GOOD

#.
NOT A T 
J bli 1

##
NOT A T
J bli 0

#..
NOT A T
OR B T
J bli 1

##.
NOT A T
OR B T
J bli 1

#.#.
NOT A T
OR B T
OR C T
T bli 1

#...
NOT A T
OR B T
T bli 1

####
NOT A J
OR B J
OR C J
T BLI 1. :(

#...
NOT A T
AND B T
AND C T??
T = 1, 0, 0...

####
NOT A 
AND B T
AND C T
T = 0, 0, 0 ...

AGHAGH SAME OUTPUT. :(

how can I just copy the value of A into the register??
AND needs both to be true... NOT flips 

OR A T... if a is true then J is true, otherwise J is false.
AND B T ... j will stay false, but if A was a block and B is a block, j will stay true
AND C T ... j will stay false but if A, B and C are blocks then J will stay true...

so we now have J = 1 if A, B and C are solid and J = 0 if there are any gaps in it. 

NOW we need to figure out if D is solid. 

if T == 0 and D == 1 then J = 1
if T == 1 and D == 0 then J = 0
if T == 0 and D == 0 then... we're dead.

OR 0 1 = 1
OR 1 0 = 1
AND 0 1 = 0
AND 1 0 = 0
.. hmmmm.

Can we get it so that T is 1 if there's gaps and 0 if there are no gaps? cos then 
we can just AND it with D and we get to know if we should jump...

NOT A T  ... t is false if there's a block, t is true if there is no block.

... needs to stay false if 
NOT A T = T is true if A is a gap, T is false if A is a block.
AND B T = T is true if A and B are blocks. T is false if A is a block.
AND C T = T is true .. we've done this already and it doesn't work

NOT A T = T is true if A is a gap, T is false if A is a block
NOT B J = J is true if A is a gap... etc
OR J T = If either are gaps then T is true.
OR C T = if ..

er..

NOT A T
OR B T
OR C T

NOT A T
NOT B J
OR T J
NOT C T
OR J T

I think this gives us 1 if there are any gaps, 0 if there's all blocks.

####
1 - T: false, J: false
2 - T: false, J: false,
3 - T: false, J: false
4 - T: false, J: false
5 - T: false, J: false

#.#.
1 - T: true, J: false,
2 - T: true, J: false
3 - T: true, J: true
4 - T: true, J: true,
5 - T: true, J: true,

##.#
1 - T: false, J: false,
2 - T: false, J: true
3 - T: true, J: true
4 - T: true, J: true,
5 - T: true, J: true,

... right seems to work. now check for D..

NOT A T
NOT B J
OR T J
NOT C T
OR T J
AND D J


WORKS!! STAR ONE DONE!!

Okay after some experiments it looks like I need to add a check
that H is safe to land on if there's a gap at E cos otherwise you end
up jumping too late and can die. 

NOT A T
NOT B J
OR T J
NOT C T
OR T J
AND D J
...
how do I reset T??
NOT T T ... that should set T to false no matter what, right?
NOT E T
.. agh I can't touch jump!!
so can't invert.
so..
OR E T // t is true if E is a block
AND F T // t is FALSE if F is not a block, but TRUE if they're both blocks.
NOT T T == that will invert t, right?
AND T J ..

didn't work.. 

NOT T T
OR E T // if e is a block then T is true, if e is a gap then T is false.
OR H T // if h is a block then T is true. If h is a gap  and e is a gap then T is false.
AND T J // cancel the jump if h and e are gaps



*/

const NEWLINE = "\n".charCodeAt(0);

const readLine = (
  generator: AsyncGenerator<number, null, boolean>
): Promise<string> => {
  return new Promise(async resolve => {
    let str = "";
    while (true) {
      let a = await generator.next();
      if (!a.done) {
        let c = String.fromCharCode(a.value);
        if (a.value === NEWLINE) {
          resolve(str);
          break;
        } else if (a.value > 127) {
          resolve("INT: " + a.value.toString());
          break;
        } else {
          str += c;
        }
      } else {
        resolve("Code halted");
        break;
      }
    }
  });
};

const writeLine = (pipe: IntcodePipe, line: string) => {
  for (const c of line) {
    pipe.addItem(c.charCodeAt(0));
  }
  pipe.addItem(NEWLINE);
};

const starOne = (program: IntcodeProgram, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { input, output } = createMachine({ program });
      console.log(await readLine(output.generator()));
      let inp = writeLine.bind(null, input);
      `NOT A T
      NOT B J
      OR T J
      NOT C T
      OR T J
      AND D J`
        .split(/\n/)
        .forEach(l => inp(l));
      inp("WALK");
      while (true) {
        let r = await readLine(output.generator());
        if (r === "Code halted") break;
        if (r.indexOf("INT") !== -1) {
          resolve(r);
        } else {
          console.log(r);
        }
      }
    }, 10);
  });
};

const starTwo = (program: IntcodeProgram, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      console.log("star two");
      const { input, output } = createMachine({ program });
      console.log(await readLine(output.generator()));
      let inp = writeLine.bind(null, input); // AND!!!!
      `NOT A T
      NOT B J
      OR T J
      NOT C T
      OR T J
      AND D J
      NOT T T
      OR E T
      OR H T
      AND T J`
        .split(/\n/)
        .forEach(l => inp(l));
      inp("RUN");
      while (true) {
        let r = await readLine(output.generator());
        if (r === "Code halted") break;
        if (r.indexOf("INT") !== -1) {
          resolve(r);
        } else {
          console.log(r);
        }
      }
    }, 10);
  });
};

export default runner;
