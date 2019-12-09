import { IntcodeProgram } from "./intcode-runner";

const parser = (code: string): IntcodeProgram => {
  return code.split(/,/g).map(m => parseInt(m, 10));
};

export default parser;
