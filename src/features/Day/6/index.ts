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

type Node = {
  id: string;
  children: Array<Node>;
  parent: Node | null;
};

const createNode = (id: string): Node => ({
  id,
  children: [],
  parent: null
});

const inputToNodeIds = (input: string) =>
  toLines(input).map(m => m.split(/\)/).map(m => m.trim()));

const starOne = (input: string, params: Record<string, any>) => {
  const map = new Map<string, Node>();

  inputToNodeIds(input).forEach(([parent, child]) => {
    if (!map.get(parent)) map.set(parent, createNode(parent));
    if (!map.get(child)) map.set(child, createNode(child));
    let pNode = map.get(parent);
    let cNode = map.get(child);
    if (pNode && cNode) {
      pNode.children.push(cNode);
      cNode.parent = pNode;
    }
  });

  let sum = 0;
  for (const node of map.values()) {
    let count = 0;
    let search = node;
    while (search.parent) {
      search = search.parent;
      count++;
    }
    sum = sum + count;
  }

  return sum.toString();
};

const starTwo = (input: string, params: Record<string, any>) => {
  const map = new Map<string, Node>();

  inputToNodeIds(input).forEach(([parent, child]) => {
    if (!map.get(parent)) map.set(parent, createNode(parent));
    if (!map.get(child)) map.set(child, createNode(child));
    let pNode = map.get(parent);
    let cNode = map.get(child);
    if (pNode && cNode) {
      pNode.children.push(cNode);
      cNode.parent = pNode;
    }
  });

  // list of all ancestors for A
  const aAncestors = [];
  let aSearch = map.get(params.starTwo[0]);
  if (aSearch !== undefined) {
    while (aSearch.parent) {
      aSearch = aSearch.parent;
      aAncestors.push(aSearch);
    }
  }

  // list of all ancestors for B
  const bAncestors = [];
  let bSearch = map.get(params.starTwo[1]);
  if (bSearch !== undefined) {
    while (bSearch.parent) {
      bSearch = bSearch.parent;
      bAncestors.push(bSearch);
    }
  }

  // find a node they have in common, then return
  // the number of steps they've taken
  let firstMatch: null | Node = null;
  for (const nodeA of aAncestors) {
    for (const nodeB of bAncestors) {
      if (nodeA === nodeB) {
        firstMatch = nodeA;
        return (
          aAncestors.indexOf(nodeA) + bAncestors.indexOf(nodeB)
        ).toString();
      }
    }
    if (firstMatch !== null) {
      break;
    }
  }
  return "Incomplete";
};

export default runner;
