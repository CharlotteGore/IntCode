import source from "./input";
import tests from "./tests";
import { toIntArray, toLines } from "../../Helpers/parsers";

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

type CardPointer = Card | null;

type Card = {
  id: number;
  pos: number;
  next: CardPointer;
  // prev: CardPointer;
};

type Stack = Card;

const dealIntoNewStack = (head: CardPointer) => {
  let current: CardPointer = head;
  let prev: CardPointer = null;
  let next: CardPointer = null;

  while (current !== null) {
    next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
};

const cutNCards = (n: number, head: CardPointer, cardsLength: number) => {
  if (n < 0) {
    n = cardsLength + n;
  }
  let current: CardPointer = head;
  let oldTop: CardPointer = head;

  let next: CardPointer = null;
  let prev: CardPointer = null;
  let newTop: CardPointer = null;
  let count = 0;
  while (current !== null) {
    prev = current;
    next = current.next;
    current = next;

    if (count === n - 1) {
      newTop = current!;
      prev.next = null;
    }
    count++;
  }
  let lastCard: CardPointer = prev as Card;
  lastCard.next = oldTop;
  return newTop;
};

const dealWithIncrementN = (
  n: number,
  head: CardPointer,
  cardsLength: number
) => {
  let current: CardPointer = head;
  let next: CardPointer = null;
  let pos = 0;
  let cards: Map<number, Card> = new Map();
  while (current !== null) {
    cards.set(pos, current);
    next = current.next;
    current = next;
    pos = (pos + n) % cardsLength;
  }
  // fix the list
  for (let i = 1; i < cardsLength - 1; i++) {
    cards.get(i)!.next = cards.get(i + 1)!;
  }
  cards.get(0)!.next = cards.get(1)!;
  cards.get(cardsLength - 1)!.next = null;
  return cards.get(0);
};

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let cards: Map<number, Card> = new Map();
      let cardsLength = params.l;
      for (let i = 0, j = -1, k = 1; i < cardsLength; i++, j++, k++) {
        cards.set(i, {
          id: i,
          pos: i,
          next: null
        });
        if (j >= 0) cards.get(j)!.next = cards.get(i)!;
      }
      debugger;

      let stack: Stack = cards.get(0)!;
      // stack = dealIntoNewStack(stack)!;

      input.split(/\n/).forEach(m => {
        let nextStack: CardPointer = stack;
        m = m.trim();
        if (m === "deal into new stack") {
          nextStack = dealIntoNewStack(stack)!;
        } else if (m.substr(0, 3) === "cut") {
          nextStack = cutNCards(parseInt(m.substr(4)), stack, cardsLength)!;
        } else if (m.substr(0, 4) === "deal") {
          nextStack = dealWithIncrementN(
            parseInt(m.substr(20)),
            stack,
            cardsLength
          )!;
        } else {
          throw new Error("unexpected input");
        }

        if (nextStack === null) {
          throw new Error("previous op fucked it");
        } else {
          stack = nextStack;
        }
      });

      let pos = 0;
      let c = stack;
      while (true) {
        if (c.next) {
          pos++;
          if (c.id === params.c) {
            resolve(pos - 1);
            break;
          } else {
            c = c.next;
          }
        } else {
          break;
        }
      }

      //stack = cutNCards(2019, stack, cardsLength)!;
      //console.log(stack);

      //resolve(stack.id);
    }, 10);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Seriously fuck knows");
    }, 1000);
  });
};

export default runner;
