import { useState, useEffect } from "react";
import day1 from "./1";
import day2 from "./2";
import day3 from "./3";
import day4 from "./4";
import day5 from "./5";
import day6 from "./6";
import day7 from "./7";
import day8 from "./8";
import day9 from "./9";
import day10 from "./10";
import day11 from "./11";
import day12 from "./12";
import day13 from "./13";
import day14 from "./14";
import day15 from "./15";
import day16 from "./16";
import day17 from "./17";
import day18 from "./18";
import day172018 from "./17-2018";

export type TestFunction = (
  star: string,
  option?: any
) => number | string | Promise<number> | Promise<string>;

const days: Record<string, TestFunction> = {
  "1": day1,
  "2": day2,
  "3": day3,
  "4": day4,
  "5": day5,
  "6": day6,
  "7": day7,
  "8": day8,
  "9": day9,
  "10": day10,
  "11": day11,
  "12": day12,
  "13": day13,
  "14": day14,
  "15": day15,
  "16": day16,
  "17": day17,
  "18": day18,
  "17-2018": day172018
};

export const useSolver = (day: string, star: string, options: any = null) => {
  const [output, setOutput] = useState<number | string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const getResult = async () => {
      setIsProcessing(true);
      const result = await days[day](star, options);
      setIsProcessing(false);
      setOutput(result);
    };
    if (days[day] && star) {
      getResult();
    }
  }, [day, star, options]);

  return {
    output,
    isProcessing
  };
};
