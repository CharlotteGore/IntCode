import { useState, useEffect } from "react";

import { DebugStateUpdate } from "./intcode-debugger";

import { createIntcodeMachine, createParallelIntcodeMachine } from "./IntcodeMachineFactory";
import { ProgramCounter } from "./intcode-runner";
import produce from "immer";

export type DebugHandler = (() => void) | undefined | null;
export type DebugSetter = ((pc: ProgramCounter) => void) | null;
export type DebugControls = {
    doStep: DebugHandler,
    doRun: DebugHandler,
    doPause: DebugHandler,
    addBreakpoint?: DebugSetter,
    clearBreakpoint?: DebugSetter,
};

export const useMachine = (id: string | undefined) => {
    const [machineState, setMachineState] = useState<DebugStateUpdate | null>(null);
    const [debugControls, setDebugControls] = useState<DebugControls>({
        doStep: () => {},
        doRun: () => {},
        doPause: () => {},
    })
    const [output, setOutput] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            const [runner, debug] = createIntcodeMachine(id) || [null, null];

            const getOutput = async () => {
                let done = false;
                
                while(!done) {
                    const result = await runner.next();
                    if (!result.done) {
                        setOutput(result.value);
                    } else {
                        done = true;
                    }
                }
            }
    
            if (runner !== null && debug !== null) {
                debug.onUpdate((update: DebugStateUpdate) => {
                    setMachineState(update);
                });
                setDebugControls({
                    doStep: debug.step.bind(debug),
                    doRun: debug.run.bind(debug),
                    doPause: debug.pause.bind(debug),
                    addBreakpoint: debug.addBreakpoint.bind(debug),
                    clearBreakpoint: debug.clearBreakpoint.bind(debug),
                })
                getOutput();
            }
            return () => { 
                debug.onFire = true;
            }
        }
    }, [id])

    return {
        machineState,
        debugControls,
        output,
    }
}

export const useDay7Machines = (input: Array<number> = [5, 6, 7, 8, 9]) => {
    const [machines, setMachines] = useState<Array<DebugStateUpdate>>([]);
    const [debugControls, setDebugControls] = useState<DebugControls>({
        doStep: () => {},
        doRun: () => {},
        doPause: () => {},
        addBreakpoint: () => {},
        clearBreakpoint: () => {},
    })
    const [output, setOutput] = useState<number | null>(null);

    useEffect(() => {
        const raw = [
            createParallelIntcodeMachine(),
            createParallelIntcodeMachine(),
            createParallelIntcodeMachine(),
            createParallelIntcodeMachine(),
            createParallelIntcodeMachine(),
        ]

        // the first machine's inputter...
        raw[0][2].setInitialValues([0, input[0]])
        raw[1][2].setInitialValues([input[1]])
        raw[2][2].setInitialValues([input[2]])
        raw[3][2].setInitialValues([input[3]])
        raw[4][2].setInitialValues([input[4]])
        // then wire all the nodes together
        raw[0][2].setSourceRunner(raw[4][0])
        raw[1][2].setSourceRunner(raw[0][0])
        raw[2][2].setSourceRunner(raw[1][0])
        raw[3][2].setSourceRunner(raw[2][0])
        raw[4][2].setSourceRunner(raw[3][0])

        let updated: Record<number, DebugStateUpdate> = {};
        const aggregateUpdates = (update: DebugStateUpdate) => {
            updated = produce(updated, draft => {
                draft[update.id] = update;
            });
            setMachines(Object.values(updated));
        }

        const getOutput = (output: number | null) => {
            if (output !== null) {
                setOutput(output);
            }
        }

        raw.forEach(([runner, debug, input]) => {
            debug.onUpdate(aggregateUpdates);
            input.setDebugMonitor(getOutput);
            runner.next();
        });



        setDebugControls({
            doStep: () => {
                raw.forEach(([_, debug]) => {
                    debug.step.call(debug)
                })
            },
            doRun: () => {
                raw.forEach(([_, debug]) => {
                    debug.run.call(debug)
                })
            },
            doPause: () => {
                raw.forEach(([_, debug]) => {
                    debug.pause.call(debug)
                })
            },
        })

        return () => { 
        }
    }, [input])

    return {
        output,
        machines,
        debugControls
    }
}