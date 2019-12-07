import produce from 'immer';
import { IntcodeRunner } from '../intcode-runner';

export type MonitorFunction = (output: number | null) => void

const createPassthroughInput = () => {
    let stack: Array<number> = [];
    let done = false;
    let runner: IntcodeRunner | null = null;
    let monitor: MonitorFunction | null = null;

    function setSourceRunner(sourceRunner: IntcodeRunner) {
        runner = sourceRunner;
    } 

    function setInitialValues(values: Array<number>) {
        stack = produce(stack, draft => draft.concat(values));
    }

    function setDebugMonitor(fn: MonitorFunction) {
        monitor = fn;
    }

    async function *generator (): AsyncGenerator<number, null, boolean> {
        while(!done) {
            if (!stack.length && runner) {
                let val = await runner.next();
                if (!val.done) {
                    if (typeof monitor === 'function') { monitor(val.value)}
                    yield val.value;
                } else {
                    return null;
                }
            } else if (stack.length > 0) {
                let value: number; 
                    stack = produce(stack, (draft: Array<number>) => {
                        value = draft.pop()!;
                    });
                if (typeof monitor === 'function') { monitor(value!)}
                yield value!;
            }
        }
        return null;
    }

    return {
        setSourceRunner,
        setInitialValues,
        setDebugMonitor,
        generator,
    };
}


export default createPassthroughInput;