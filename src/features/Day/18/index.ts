import source from "./input";

import { TestFunction } from "../hooks";
import { Vector2d, distance } from "../../Helpers/vector";

const runner: TestFunction = async (star: string) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { inputMain, params } = source;
    output.push(`Actual result: ${await starOne(inputMain, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star two test...
    const { params } = source;
    output.push(`Actual result: ${await starTwo(params.tl, params)}`);

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

type DoorSearchItem = [number, number, number, string];

const checkIfPossible = (path: string, keys: string = "", to: string) => {
  // no point checking anything we've already visited...
  if (keys.includes(to)) return false;
  let i = 1;
  let test = keys;
  while (path[i]) {
    let c = path[i];
    let v = c.charCodeAt(0);
    if (v >= 97 && v <= 122) {
      test += c;
      i++;
    } else if (c === "@") {
      i++;
    } else {
      if (test.includes(path[i].toLowerCase())) {
        i++;
        continue;
      }
      return false;
    }
  }
  return true;
};

const checkIfPossible2 = (
  path: string,
  visited: string = "",
  to: string,
  listOfKeys: Record<string, Vector2d>
) => {
  // no point checking anything we've already visited...
  if (visited.includes(to)) return false;
  let i = 1;
  let test = visited;
  while (path[i]) {
    let c = path[i];
    let v = c.charCodeAt(0);
    if (v >= 97 && v <= 122) {
      test += c;
      i++;
    } else if (c === "@") {
      i++;
    } else {
      if (test.includes(path[i].toLowerCase()) || !listOfKeys[path[i]]) {
        i++;
        continue;
      }
      return false;
    }
  }
  return true;
};

const findAllTheThings = (
  start: Vector2d,
  grid: string[][],
  target: Vector2d
): [number, boolean, string] => {
  const q: DoorSearchItem[] = [
    [start[0], start[1], 0, grid[start[0]][start[1]]]
  ];
  let qIndex = 0;
  let found = false;
  let steps: number = 0;
  type Trie = Record<number, Record<number, number>>;

  const trie: Trie = {};
  while (q[qIndex] && !found) {
    let i: DoorSearchItem = q[qIndex];
    let c = i[2] + 1;
    let items: DoorSearchItem[] = [];
    let up = grid[i[0]] ? grid[i[0]][i[1] - 1] : "#";
    let down = grid[i[0]] ? grid[i[0]][i[1] + 1] : "#";
    let left = grid[i[0] - 1] ? grid[i[0] - 1][i[1]] : "#";
    let right = grid[i[0] + 1] ? grid[i[0] + 1][i[1]] : "#";

    if (up !== "#") {
      items.push([i[0], i[1] - 1, c, up]);
    }
    if (down !== "#") {
      items.push([i[0], i[1] + 1, c, down]);
    }
    if (left !== "#") {
      items.push([i[0] - 1, i[1], c, left]);
    }
    if (right !== "#") {
      items.push([i[0] + 1, i[1], c, right]);
    }
    for (const n of items) {
      let x = n[0];
      let y = n[1];
      let s = n[2];
      if (x === target[0] && y === target[1]) {
        found = true;
        steps = c;
      }
      if (trie[x]) {
        if (trie[x][y]) {
          if (trie[x][y] > c) {
            trie[x][y] = c;
            q.push(n);
          }
        } else {
          q.push(n);
          trie[x][y] = s;
        }
      } else {
        trie[x] = {
          [y]: s
        };
        q.push(n);
      }
    }
    qIndex++;
  }
  if (found) {
    let path: [number, number, string][] = [];
    let first: DoorSearchItem | undefined = q.find(
      m => m[0] === target[0] && m[1] === target[1]
    );
    let stuff: string[] = [];
    if (first !== undefined) {
      let done = false;
      let current: DoorSearchItem = first;
      while (!done) {
        let next = q.find(
          // eslint-disable-next-line no-loop-func
          m =>
            m[2] === current[2]! - 1 &&
            distance([m[0], m[1]], [current[0], current[1]]) === 1
        );
        if (next) {
          path.push([next[0], next[1], next[3]]);
          current = next;
          if (next[0] === start[0] && next[1] === start[1]) {
            done = true;
          }
        } else {
          throw new Error(
            "pathfinding error: Could not find next step on path"
          );
        }
      }
      for (const step of path) {
        let v = step[2];
        if (v.match(/[A-Za-z]/)) {
          stuff.push(v);
        }
      }
      let routeprefix = grid[start[0]][start[1]] === "@" ? ["@"] : [];
      const route = routeprefix
        .concat([...stuff.reverse(), grid[target[0]][target[1]]])
        .join("");
      return [steps, true, route];
    } else {
      throw new Error("pathfinding error: Path to target not found");
    }
  } else {
    throw new Error("pathfinding error: Target not found");
  }
};

const starOne = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // @ entrance
      // A-Z doors
      // a-z keys

      const grid = input
        .split(/\n/g)
        .map(m => m.trim())
        .map(m => Array.from(m));
      const keys: Record<string, Vector2d> = {};
      const doors: Record<string, Vector2d> = {};
      for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
          let v = grid[x][y];
          let c = v.charCodeAt(0);
          if (c >= 97 && c <= 122) {
            keys[v] = [x, y];
          } else if (c >= 65 && c <= 90) {
            doors[v] = [x, y];
          } else if (c === 64) {
            keys[v] = [x, y];
          }
        }
      }

      const allKeysToKeys: Record<
        string,
        Record<string, [number, boolean, string]>
      > = {}; // JSON.parse(params.preComputed);

      const start = performance.now();

      for (const from of Object.keys(keys)) {
        allKeysToKeys[from] = {};
        for (const to of Object.keys(keys)) {
          if (from === to) continue;
          if (to === "@") continue;
          allKeysToKeys[from][to] = findAllTheThings(
            keys[from],
            grid,
            keys[to]
          );
        }
      }

      console.log(performance.now() - start);

      //console.log(JSON.stringify(allKeysToKeys));
      const s = performance.now();
      type Node = { route: string; steps: number };

      const root: Node = {
        route: "@",
        steps: 0
      };

      let q = [root];
      let routeTest: Record<string, Node> = {};
      let qIndex = 0;
      let longest = 0;
      let iter = 0;
      let endNodes: Array<Node> = [];
      while (q[qIndex]) {
        let node = q[qIndex];
        let start = node.route.substr(-1);
        let fromLookup = allKeysToKeys[start];
        let possibles: string[] = Object.keys(fromLookup)
          .filter(key => !node.route.includes(key))
          .filter(key => checkIfPossible(fromLookup[key][2], node.route, key));
        if (possibles.length === 0) {
          if (node.route.length === Object.keys(allKeysToKeys).length) {
            endNodes.push(node);
            qIndex++;
            continue;
          } else {
            qIndex++;
            continue;
          }
        }
        for (let k of possibles) {
          let arr: [number, boolean, string] = fromLookup[k];
          let steps = arr[0];
          let route = arr[2];
          let str = node.route;
          for (let i = 0; i < route.length; i++) {
            let c = route[i].charCodeAt(0);
            if (c >= 97 && c <= 122 && str.indexOf(route[i]) === -1) {
              str += route[i];
            }
          }

          iter++;
          if (iter % 100000 === 0) {
            console.log(iter, longest, q[0].route.length);
          }
          route = str;
          let sortedRoute =
            route.substr(0, 1) +
            Array.from(route.substr(1, route.length - 2))
              .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
              .join("") +
            route.substr(route.length - 1);
          if (!routeTest[sortedRoute]) {
            let child: Node = {
              route,
              steps: node.steps + steps
            };
            q.push(child);
            if (route.length > longest) longest = route.length;
            routeTest[sortedRoute] = child;
          } else {
            let child: Node = {
              route,
              steps: node.steps + steps
            };
            let current = routeTest[sortedRoute];
            if (child.steps < current.steps) {
              routeTest[sortedRoute] = child;
              q.push(child);
            }
          }
        }
        q.splice(0, 1);
      }
      console.log(routeTest);
      console.log(performance.now() - s, iter);

      let result = endNodes
        .map((n): [string, number] => {
          let steps = 0;
          for (let i = 0; i < n.route.length - 1; i++) {
            var a = n.route[i];
            var b = n.route[i + 1];
            steps += allKeysToKeys[a][b][0];
          }
          return [n.route, steps];
        })
        .sort((a, b) => a[1] - b[1]);
      console.log(`Optimal route found: ${result[0][0]} at ${result[0][1]}`);
      resolve(result[0][1]);
    }, 1000);
  });
};

const starTwoProcessQuadrant = (input: string) => {
  // @ entrance
  // A-Z doors
  // a-z keys
  const grid = input
    .split(/\n/g)
    .map(m => m.trim())
    .map(m => Array.from(m));
  const keys: Record<string, Vector2d> = {};
  const doors: Record<string, Vector2d> = {};
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      let v = grid[x][y];
      let c = v.charCodeAt(0);
      if (c >= 97 && c <= 122) {
        keys[v] = [x, y];
      } else if (c >= 65 && c <= 90) {
        doors[v] = [x, y];
      } else if (c === 64) {
        keys[v] = [x, y];
      }
    }
  }

  const allKeysToKeys: Record<
    string,
    Record<string, [number, boolean, string]>
  > = {}; // JSON.parse(params.preComputed);

  const start = performance.now();

  for (const from of Object.keys(keys)) {
    allKeysToKeys[from] = {};
    for (const to of Object.keys(keys)) {
      if (from === to) continue;
      if (to === "@") continue;
      allKeysToKeys[from][to] = findAllTheThings(keys[from], grid, keys[to]);
    }
  }

  debugger;

  //console.log(JSON.stringify(allKeysToKeys));

  type Node = { route: string; steps: number };

  const root: Node = {
    route: "@",
    steps: 0
  };

  let q = [root];
  let routeTest: Record<string, Node> = {};
  let qIndex = 0;
  let longest = 0;
  let iter = 0;
  let endNodes: Array<Node> = [];
  while (q[qIndex]) {
    let node = q[qIndex];
    let start = node.route.substr(-1);
    let fromLookup = allKeysToKeys[start];
    let possibles: string[] = Object.keys(fromLookup)
      .filter(key => !node.route.includes(key))
      .filter(key =>
        checkIfPossible2(fromLookup[key][2], node.route, key, keys)
      );
    if (possibles.length === 0) {
      if (node.route.length === Object.keys(allKeysToKeys).length) {
        console.log("found an end node", node);
        endNodes.push(node);
        qIndex++;
        continue;
      } else {
        console.log("found a dead end", node);
        qIndex++;
        continue;
      }
    }
    for (let k of possibles) {
      let arr: [number, boolean, string] = fromLookup[k];
      let steps = arr[0];
      let route = arr[2];
      let str = node.route;
      for (let i = 0; i < route.length; i++) {
        let c = route[i].charCodeAt(0);
        if (c >= 97 && c <= 122 && str.indexOf(route[i]) === -1) {
          str += route[i];
        }
      }

      iter++;
      if (iter % 100000 === 0) {
        console.log(iter, longest, q[0].route.length);
      }
      route = str;
      let sortedRoute =
        route.substr(0, 1) +
        Array.from(route.substr(1, route.length - 2))
          .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
          .join("") +
        route.substr(route.length - 1);
      if (!routeTest[sortedRoute]) {
        let child: Node = {
          route,
          steps: node.steps + steps
        };
        q.push(child);
        if (route.length > longest) longest = route.length;
        routeTest[sortedRoute] = child;
      } else {
        let child: Node = {
          route,
          steps: node.steps + steps
        };
        let current = routeTest[sortedRoute];
        if (child.steps < current.steps) {
          routeTest[sortedRoute] = child;
          q.push(child);
        }
      }
    }
    q.splice(0, 1);
  }
  console.log(routeTest);
  console.log(performance.now() - start);

  let result = endNodes
    .map((n): [string, number] => {
      let steps = 0;
      for (let i = 0; i < n.route.length - 1; i++) {
        var a = n.route[i];
        var b = n.route[i + 1];
        steps += allKeysToKeys[a][b][0];
      }
      return [n.route, steps];
    })
    .sort((a, b) => a[1] - b[1]);
  console.log(`Optimal route found: ${result[0][0]} at ${result[0][1]}`);
  return result[0][1];
};

const starTwo = (input: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      debugger;
      const tl = starTwoProcessQuadrant(params.tl);
      const bl = starTwoProcessQuadrant(params.bl);
      const tr = starTwoProcessQuadrant(params.tr);
      const br = starTwoProcessQuadrant(params.br);

      resolve(tl + bl + tr + br);
    }, 1000);
  });
};

export default runner;
