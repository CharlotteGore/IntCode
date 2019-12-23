import source from "./input";
import tests from "./tests";
import { toLines } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { RefObject } from "react";

/*

+     +
.     |

|     |
.     |

|     |
|     |

|    |||
#     #

#|   #||
 #    #

 |#  ||#
 #    #

#||  #~|
 #    #

~||  ~~|
 #    #

~|~  ~~~
 #    #

 |   |||
 ~    ~

|||  |||
 ~    ~
*/

const runner: TestFunction = async (
  star: string,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
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
    if (canvasRef) {
      output.push(`Actual result: ${await starOne(input, params, canvasRef)}`);
    }

    return output.join(" - ");
  } else if (star === "2") {
    const testCases = tests[2];
    for (let i = 0; i < testCases.length; i++) {
      const { input, expected, params } = testCases[i];
      const result = await starOne(input, params, canvasRef);
      if (result === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      } else {
        output.push(`Test case ${i + 1} fails ${result} should be ${expected}`);
      }
    }

    // run the actual star two test...
    //const { input, params } = source;
    //output.push(`Actual result: ${starTwo(input, params)}`);

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

enum CellType {
  EMPTY = ".".charCodeAt(0),
  CLAY = "#".charCodeAt(0),
  WATER = "~".charCodeAt(0),
  RUNNING_WATER = "|".charCodeAt(0),
  ORIGIN = "+".charCodeAt(0)
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

const generateGrid = (view: View) => {
  const dataView = new Uint8Array(new ArrayBuffer(view.w * view.h));
  for (let i = 0; i < dataView.length; i++) {
    dataView[i] = CellType.EMPTY;
  }
  return {
    get: (x: number, y: number): CellType => {
      return dataView[(y - view.yoff) * view.w + (x - view.xoff)];
    },
    set: (x: number, y: number, value: CellType) => {
      dataView[(y - view.yoff) * view.w + (x - view.xoff)] = value;
    }
  };
};

const applyVein = (
  set: (x: number, y: number, value: CellType) => void,
  vein: Vein
) => {
  let l = Math.abs(vein[2] - vein[0]) + Math.abs(vein[3] - vein[1]);
  const xv = (vein[2] - vein[0]) / l;
  const yv = (vein[3] - vein[1]) / l;
  let x = vein[0];
  let y = vein[1];
  while (l > -1) {
    set(x, y, CellType.CLAY);
    x += xv;
    y += yv;
    l--;
  }
};

const render = (
  get: (x: number, y: number) => CellType,
  extents: Extents,
  ctx: CanvasRenderingContext2D
) => {
  //let str = ``;
  for (let y = extents.t; y < extents.b; y++) {
    for (let x = extents.l; x < extents.r; x++) {
      //if (x === 560 && y === 453) {
      //  str += "?";
      //} else {
      let v = get(x, y);
      if (v === CellType.CLAY) {
        ctx.fillStyle = "#ffa542";
        ctx.fillRect(x - extents.l, y - extents.t, 1, 1);
      } else if (v === CellType.WATER) {
        ctx.fillStyle = "#000044";
        ctx.fillRect(x - extents.l, y - extents.t, 1, 1);
      } else if (v === CellType.RUNNING_WATER) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - extents.l, y - extents.t, 1, 1);
      } else {
        ctx.fillStyle = "#222222";
        ctx.fillRect(x - extents.l, y - extents.t, 1, 1);
      }
      //str += v ? String.fromCharCode(v) : ".";
      // }
    }
    //str += "\n";
  }
  //html.innerHTML = str;
};

type Cell = Generator<[CellType, number, number][], null, boolean>;

function* cell(
  type: CellType,
  x: number,
  y: number,
  get: (x: number, y: number) => CellType
): Cell {
  //if (x === 560 && y === 453) {
  //  debugger;
  //}
  if (type === CellType.ORIGIN) {
    yield [[CellType.RUNNING_WATER, x, y + 1]];
    console.log(type, x, y, "dead because ejected");
    return null;
  } else if (type === CellType.RUNNING_WATER) {
    //let done = false;
    //while (!done) {
    let below = get(x, y + 1);
    let left = get(x - 1, y);
    let right = get(x + 1, y);

    if (below === CellType.EMPTY) {
      yield [[CellType.RUNNING_WATER, x, y + 1]];
    } else if (below === CellType.CLAY || below === CellType.WATER) {
      if (left === CellType.EMPTY && right === CellType.EMPTY) {
        yield [
          [CellType.RUNNING_WATER, x - 1, y],
          [CellType.RUNNING_WATER, x + 1, y]
        ];
        //console.log(type, x, y, "dead because has found way to spread");
        return null;
      } else if (left === CellType.EMPTY) {
        yield [[CellType.RUNNING_WATER, x - 1, y]];
        //console.log(type, x, y, "dead because has found way to spread");
        return null;
      } else if (right === CellType.EMPTY) {
        yield [[CellType.RUNNING_WATER, x + 1, y]];
        //console.log(type, x, y, "dead because has found way to spread");
        return null;
      } else if (left === CellType.CLAY) {
        let i = 0;
        while (true) {
          i++;
          let n = get(x + i, y);
          if (!n) {
            //console.log(type, x, y, "dead (out of bounds)");
            return null;
          }
          if (n === CellType.CLAY) {
            yield [[CellType.WATER, x, y]];
            return null;
          } else if (n === CellType.EMPTY) {
            let m = get(x, y + 1);
            if (!m) {
              //console.log(type, x, y, "dead (out of bounds)");
              return null;
            }
            if (m === CellType.CLAY) {
              yield [[CellType.WATER, x, y]];
            } else if (m === CellType.WATER || m === CellType.RUNNING_WATER) {
              // follow the water until the end of the clay
              let j = 0;
              while (true) {
                j++;
                m = get(x + j, y + 1);
                if (!m) return null;
                if (m === CellType.CLAY) {
                  if (get(x + j, y) === CellType.CLAY) {
                    yield [[CellType.WATER, x, y]];
                    //console.log(type, x, y, "dead");
                    return null;
                  } else {
                    //console.log(type, x, y, "dead");
                    return null;
                  }
                }
              }
            }
          }
        }
      } else if (right === CellType.CLAY) {
        let i = 0;
        while (true) {
          i++;
          let n = get(x - i, y);
          if (!n) {
            //console.log(type, x, y, "dead (out of bounds)");
            return null;
          }
          if (n === CellType.CLAY) {
            yield [[CellType.WATER, x, y]];
            //console.log(type, x, y, "dead");
            return null;
          } else if (n === CellType.EMPTY) {
            let m = get(x, y + 1);
            if (!m) {
              //console.log(type, x, y, "dead (out of bounds)");
              return null;
            }
            if (m === CellType.CLAY) {
              yield [[CellType.WATER, x, y]];
            } else if (m === CellType.WATER || m === CellType.RUNNING_WATER) {
              // follow the water until the end of the clay
              let j = 0;
              while (true) {
                j++;
                m = get(x - j, y + 1);
                if (!m) return null;
                if (m === CellType.CLAY) {
                  if (get(x - j, y) === CellType.CLAY) {
                    yield [[CellType.WATER, x, y]];
                    //console.log(type, x, y, "dead");
                    return null;
                  } else {
                    //console.log(type, x, y, "dead");
                    return null;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      //console.log(type, x, y, "dead");
      return null;
    }
  } else if (type === CellType.WATER) {
    let left = get(x - 1, y);
    let right = get(x + 1, y);
    let up = get(x, y - 1);
    const yields: [CellType, number, number][] = [];
    //if (x === 560 && y - 1 === 453) {
    //  debugger;
    //}
    if (left === CellType.RUNNING_WATER) {
      yields.push([CellType.WATER, x - 1, y]);
    }
    if (right === CellType.RUNNING_WATER) {
      yields.push([CellType.WATER, x + 1, y]);
    }

    if (up === CellType.RUNNING_WATER) {
      //debugger;
      let tl = get(x - 1, y - 1);
      let tr = get(x + 1, y - 1);
      let tlokay = false;
      let trokay = false;
      if (tl === CellType.EMPTY || tl === CellType.CLAY) {
        tlokay = true;
      }
      if (
        tr === CellType.EMPTY ||
        tr === CellType.CLAY
        // (tr === CellType.EMPTY && tl === CellType.RUNNING_WATER)
      ) {
        trokay = true;
      }
      if (
        (tlokay && trokay) ||
        (tl === CellType.EMPTY && tr === CellType.RUNNING_WATER) ||
        (tr === CellType.EMPTY && tl === CellType.RUNNING_WATER)
      ) {
        yields.push([CellType.RUNNING_WATER, x, y - 1]);
      }
    }
    yield yields;
    //console.log(type, x, y, "dead");
    return null;
  }
  return null;
}

const starOne = (
  input: string,
  params: Record<string, any>,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  return new Promise(resolve => {
    const veins = parseVeins(input);
    const extents = computeExtents(veins);
    const view = generateView(extents);
    const { get, set } = generateGrid(view);
    const veinWriter = applyVein.bind(null, set);
    const ctx = canvasRef.current!.getContext("2d") as CanvasRenderingContext2D;

    canvasRef.current!.width = view.w;
    canvasRef.current!.height = view.h;

    ctx.fillStyle = "#ff4400";
    for (const vein of veins) {
      veinWriter(vein);
    }

    let cells: Cell[] = [];
    //cells.push(cell(CellType.ORIGIN, 500, 0, get));
    cells.push(cell(CellType.ORIGIN, 500, 2, get));

    let iterations = 0;
    const iterate = () => {
      iterations++;
      let nextCells: Cell[] = [];
      let newCells: [CellType, number, number][] = [];
      for (const c of cells) {
        let v = c.next();
        if (!v.done) {
          // the cell lives on.
          nextCells.push(c);

          //if (!newCells.find(m => m[0] === v.value[0] && m))
          // }

          newCells = newCells.concat(v.value!);
        }
      }
      for (const n of newCells) {
        if (n[2] <= extents.b) {
          set(n[1], n[2], n[0]);
          if (n[0] === CellType.RUNNING_WATER) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(n[1] - extents.l, n[2] - extents.t, 1, 1);
          } else if (n[0] === CellType.WATER) {
            ctx.fillStyle = "#000044";
            ctx.fillRect(n[1] - extents.l, n[2] - extents.t, 1, 1);
          }
          //if (n[1] === 560 && n[2] === 453) {
          //  debugger;
          //}
          nextCells.push(cell(n[0], n[1], n[2], get));
        }
      }
      cells = nextCells;
      if (cells.length) {
        //if (iterations === 2800) {
        //  r();
        //  setTimeout(iterate, 0);
        //} else if (iterations > 2800) {
        //setTimeout(iterate, 250);
        //// } else {
        //iterate();
        return null;
        //}
      } else {
        let sum = 0;
        for (let y = extents.t; y < extents.b; y++) {
          for (let x = extents.l; x < extents.r; x++) {
            let v = get(x, y);
            if (v === CellType.WATER || v === CellType.RUNNING_WATER) {
              sum++;
            }
          }
        }
        //render(get, extents);
        console.log(
          `Done in ${iterations} iterations, with ${sum} blocks of water`
        );
        return sum;
      }
    };

    // render(get, extents);

    render(get, extents, ctx);

    var interval = setInterval(() => {
      let res = iterate();
      if (res) {
        clearInterval(interval);
        resolve(res);
      }
      //render(get, extents, ctx);
    }, 10);

    /*
    let done = false;
    while (!done) {
      let res = iterate();
      //if (iterations % 1000 === 0) {
      // console.log("render");
      //  render(get, extents);
      //}
      if (res) {
        done = true;
        render(get, extents, ctx);
        resolve(res);
        break;
      }
      
    }
    */

    //const r = () => {
    //  render(get, extents);
    //  requestAnimationFrame(r);
    //};
    //setTimeout(iterate, 5);
    //requestAnimationFrame(r);
  });
};

const starTwo = (input: string, params: Record<string, any>) => {
  return "Not Implemented";
};

export default runner;
