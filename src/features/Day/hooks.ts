import { useState, useEffect } from "react";
import day8 from "./8";
import day9 from "./9";
import day1 from "./1";
import experiment from "./Experiment";

export type TestFunction = (
  star: string,
  option?: any
) => number | string | Promise<number> | Promise<string>;

const days: Record<string, TestFunction> = {
  "8": day8,
  "9": day9,
  "1": day1,
  experiment: experiment
};

export const useSolver = (day: string, star: string, options: any = null) => {
  const [output, setOutput] = useState<number | string | null>(null);

  useEffect(() => {
    const getResult = async () => {
      const result = await days[day](star, options);
      setOutput(result);
    };
    if (days[day] && star) {
      getResult();
    }
  }, [day, star, options]);

  return {
    output
  };
};
