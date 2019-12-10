import { useState, useEffect } from "react";
import day1 from './1';
import day2 from './2';
import day8 from "./8";
import day9 from "./9";
import day10 from "./10";
import day11 from "./11";
import day3 from './3';
import day4 from './4';

export type TestFunction = (
  star: string,
  option?: any
) => number | string | Promise<number> | Promise<string>;

const days: Record<string, TestFunction> = {
  "1": day1,
  "2": day2,
  "3": day3,
  "4": day4,
  "8": day8,
  "9": day9,
  "10": day10,
  "11": day11,
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
    isProcessing,
  };
};
