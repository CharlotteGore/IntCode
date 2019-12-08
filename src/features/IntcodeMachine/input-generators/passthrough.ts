import produce from "immer";
import { IntcodeRunner } from "../intcode-runner";
import { exec } from "child_process";

export type MonitorFunction = (output: number | null) => void;

const createPassthroughInput = () => {
  let queue: Array<number> = [];
  let done = false;
  let runner: IntcodeRunner | null = null;
  let monitor: MonitorFunction | null = null;
  let resume: any | null;

  async function* setSourceRunner(sourceRunner: IntcodeRunner) {
    console.log("does this even run");
    runner = sourceRunner;
    while (true) {
      console.log("waiting on next output from ", runner);
      const val = await runner.next();
      if (val.done) {
        break;
        done = true;
      }
      if (resume) resume();
    }
  }

  function setInitialValues(values: Array<number>) {
    queue = values;
  }

  function setDebugMonitor(fn: MonitorFunction) {
    // monitor = fn;
  }

  function pause() {
    return new Promise(resolve => {
      resume = () => {
        console.log("resume called");
        resume = null;
        resolve(true);
      };
    });
  }

  async function* generator(): AsyncGenerator<number, null, boolean> {
    while (!done) {
      if (queue.length) {
        console.log("popping from the queue");
        yield queue.pop()!;
      } else {
        console.log("waiting on resume...");
        await pause();
      }
    }
    return null;
  }

  return {
    setSourceRunner,
    setInitialValues,
    setDebugMonitor,
    generator
  };
};

export default createPassthroughInput;
