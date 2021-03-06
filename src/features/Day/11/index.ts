import source from "./input";
import {
  createMachine,
  createDebugMachine
} from "../../IntcodeMachine/machine";
import { Vector2d, UnitVector2d, add } from "../../Helpers/vector";
import { RefObject } from "react";
import { COLOR } from "../8";

const runner = async (
  star: string,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  let output: Array<string> = [];

  if (star === "1") {
    // run the actual star one test...
    const { input, params } = source;
    output.push(`Actual result: ${await starOne(input, params)}`);

    return output.join(" - ");
  } else if (star === "2") {
    // run the actual star two test...
    const { input, params } = source;
    const { width, height, grid, xOffset, yOffset } = await starTwo(
      input,
      params
    );

    if (canvasRef) {
      canvasRef.current!.width = width;
      canvasRef.current!.height = height;
      const ctx = canvasRef.current!.getContext("2d");
      const imgData = ctx!.createImageData(width, height);
      for (let x = 0; x < width + 1; x++) {
        for (let y = 0; y < height + 1; y++) {
          if (
            grid[xOffset + x] &&
            grid[xOffset + x][yOffset + y] !== undefined
          ) {
            let col = grid[xOffset + x][yOffset + y];
            if (col === COLOR.BLACK) {
              imgData.data[(y * width + x) * 4 + 0] = 255;
              imgData.data[(y * width + x) * 4 + 1] = 255;
              imgData.data[(y * width + x) * 4 + 2] = 255;
              imgData.data[(y * width + x) * 4 + 3] = 255;
            } else {
              imgData.data[(y * width + x) * 4 + 3] = 255;
            }
          }
        }
      }
      ctx!.putImageData(imgData, 0, 0);
      output.push(`Rendered result`);
    }

    return output.join(" - ");
  } else {
    return "Invalid star";
  }
};

const starOne = async (_: string, params: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { input, output /* debug */ } = createMachine({
        code: "day11"
      });

      const gen = output.generator();

      //debug.run();

      let grid: Record<number, Record<number, number>> = {};
      let pos: Vector2d = [0, 0];
      let cellsVisited = 0;
      let dir: UnitVector2d = [0, -1];

      while (true) {
        if (!grid[pos[0]]) grid[pos[0]] = {};
        if (grid[pos[0]][pos[1]] === undefined) {
          if (cellsVisited > 0) {
            grid[pos[0]][pos[1]] = 0;
            input.addItem(0);
          }
          cellsVisited++;
        } else {
          let col = grid[pos[0]][pos[1]];
          input.addItem(col);
        }
        let cell = grid[pos[0]][pos[1]];
        if (cell === undefined) {
          input.addItem(cell);
        }
        let color = await gen.next();
        let direction = await gen.next();
        if (
          color.done ||
          direction.done ||
          color.value === -1 ||
          direction.value === -1
        ) {
          resolve(cellsVisited.toString());
          return null;
        }
        grid[pos[0]][pos[1]] = color.value;
        dir = [dir[1], dir[0]];
        dir[direction.value ? 0 : 1] = dir[direction.value ? 0 : 1] * -1;
        pos = add(pos, dir);
      }
    }, 10);
  });
};

const starTwo = async (
  _: string,
  params: Record<string, any>
): Promise<{
  width: number;
  height: number;
  grid: Record<number, Record<number, number>>;
  xOffset: number;
  yOffset: number;
}> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { input, output } = createMachine({
        code: "day11"
      });

      let gen = output.generator();

      let grid: Record<number, Record<number, number>> = {};
      let pos: Vector2d = [0, 0];
      let cellsVisited = 0;
      let dir: UnitVector2d = [0, -1];
      let minx = Infinity;
      let maxx = -Infinity;
      let miny = Infinity;
      let maxy = -Infinity;

      while (true) {
        if (!grid[pos[0]]) grid[pos[0]] = {};
        if (grid[pos[0]][pos[1]] === undefined) {
          if (pos[0] < minx) minx = pos[0];
          if (pos[0] > maxx) maxx = pos[0];
          if (pos[1] < miny) miny = pos[1];
          if (pos[1] > maxy) maxy = pos[1];
          if (cellsVisited > 0) {
            grid[pos[0]][pos[1]] = 0;
            input.addItem(0);
          } else {
            grid[pos[0]][pos[1]] = 1;
            input.addItem(1);
          }
          cellsVisited++;
        } else {
          let col = grid[pos[0]][pos[1]];
          input.addItem(col);
        }
        let cell = grid[pos[0]][pos[1]];
        if (cell === undefined) {
          input.addItem(cell);
        }
        let color = await gen.next();
        let direction = await gen.next();
        if (
          color.done ||
          direction.done ||
          color.value === -1 ||
          direction.value === -1
        ) {
          break;
          // return cellsVisited.toString();
        }
        grid[pos[0]][pos[1]] = color.value;
        dir = [dir[1], dir[0]];
        dir[direction.value ? 0 : 1] = dir[direction.value ? 0 : 1] * -1;
        pos = add(pos, dir);
      }

      const width = maxx - minx + 4;
      const height = maxy - miny + 4;
      const yOffset = miny - 2;
      const xOffset = minx - 2;

      resolve({ width, height, grid, yOffset, xOffset });
    }, 10);
  });
};

export default runner;
