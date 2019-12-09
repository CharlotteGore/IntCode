import input from "./input";
import tests from "./tests";
import { toIntArray } from "../../Helpers/parsers";

import { TestFunction } from "../hooks";
import { RefObject } from "react";

enum COLOR {
  BLACK = 0,
  WHITE = 1,
  TRANSPARENT = 2
}

const runner: TestFunction = (
  star: string,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  let output: Array<string> = [];

  const parsed = toIntArray(input.input); //Array.from<string>(input.input).map((m: string) => parseInt(m, 10));
  const { width, height } = input.params;

  const layers = getLayers(parsed, width, height);

  if (star === "1") {
    const testCases = tests[1];
    for (let i = 0; i < testCases.length; i++) {
      const {
        input,
        expected,
        params: { width, height }
      } = testCases[i];
      const testLayers = getLayers(toIntArray(input), width, height);
      const result = starOne(testLayers);
      if (result.toString() === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      }
    }

    output.push(`Input case evaluates to ${starOne(layers)}`);

    return output.join(", ");
  } else if (star === "2") {
    const testCases = tests[2];
    for (let i = 0; i < testCases.length; i++) {
      const {
        input,
        expected,
        params: { width, height }
      } = testCases[i];
      const testLayers = getLayers(toIntArray(input), width, height);
      const result = flatten(testLayers, width, height).join("");
      if (result.toString() === expected) {
        output.push(`Test case ${i + 1} passes (${expected})`);
      }
    }

    const result = flatten(layers, width, height);
    if (canvasRef) {
      const ctx = canvasRef.current!.getContext("2d");
      const imgData = ctx!.createImageData(width, height);
      for (let i = 0; i < result.length; i++) {
        let v = result[i];
        if (v === COLOR.BLACK) {
          imgData.data[i * 4 + 3] = 255;
        } else if (v === COLOR.WHITE) {
          imgData.data[i * 4 + 0] = 255;
          imgData.data[i * 4 + 1] = 255;
          imgData.data[i * 4 + 2] = 255;
          imgData.data[i * 4 + 3] = 255;
        }
      }
      ctx!.putImageData(imgData, 0, 0);
      output.push("image rendered");
      return output.join(", ");
    } else {
      return "tbc";
    }
  } else {
    return "not yet implemented";
  }
};

const starOne = (layers: Array<Array<number>>) => {
  return getLayerChecksum(findFewestZeros(layers));
};

const flatten = (
  layers: Array<Array<number>>,
  width: number,
  height: number
) => {
  let result = new Array(width * height).fill(2);
  for (let i = 0; i < width * height; i++) {
    for (let j = 0; j < layers.length; j++) {
      let v = layers[j][i];
      if (v === COLOR.BLACK || v === COLOR.WHITE) {
        result[i] = v;
        break;
      }
    }
  }
  return result;
};

const getLayers = (arr: Array<number>, width: number, height: number) => {
  const layerCount = arr.length / (width * height);
  const layers = [];
  for (let i = 0; i < layerCount; i++) {
    layers.push(
      arr.slice(i * (width * height), i * (width * height) + width * height)
    );
  }
  return layers;
};

const findFewestZeros = (layers: Array<Array<number>>): Array<number> =>
  layers
    .map(layer => {
      const zeros = layer.reduce((sum, digit) => {
        if (digit === 0) sum++;
        return sum;
      }, 0);
      return {
        layer,
        zeros
      };
    }, [])
    .sort((a, b) => a.zeros - b.zeros)[0].layer;

const getLayerChecksum = (layer: Array<number>): number => {
  const [ones, twos] = layer.reduce(
    (sums, digit) => {
      let [ones, twos] = sums;
      if (digit === 1) ones++;
      if (digit === 2) twos++;
      return [ones, twos];
    },
    [0, 0]
  );
  return ones * twos;
};

export default runner;
