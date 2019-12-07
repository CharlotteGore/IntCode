import React from 'react';
import './intcode.css';
import Params from './Params';
import CurrentOp from './CurrentOp';
import { useDay7Machines } from './hooks';

const LotsOfMachines = (props: { input: Array<number>}) => {
    const {
        machines,
        debugControls,
        output,
    } = useDay7Machines(props.input);

    if (machines.length) {
        return <>
            <div className="IntcodeMachines Parallel">
            
                {
                    machines[0] && debugControls && <div className="IntcodeMachine" key={0}>
                        <h3>Machine A</h3>
                        <Params machine={machines[0]} />
                        <CurrentOp machine={machines[0]} />
                    </div>
                }
                {
                    machines[1] && debugControls && <div className="IntcodeMachine"key={1}>
                        <h3>Machine B</h3>
                        <Params machine={machines[1]} />
                        <CurrentOp machine={machines[1]} />
                    </div>
                }
                {
                    machines[2] && debugControls && <div className="IntcodeMachine"key={2}>
                        <h3>Machine C</h3>
                        <Params machine={machines[2]} />
                        <CurrentOp machine={machines[2]} />
                    </div>
                }
                {
                    machines[3] && debugControls && <div className="IntcodeMachine"key={3}>
                        <h3>Machine D</h3>
                        <Params machine={machines[3]} />
                        <CurrentOp machine={machines[3]} />
                    </div>
                }
                {
                    machines[4] && debugControls && <div key={4} className="IntcodeMachine">
                        <h3>Machine D</h3>
                        <Params machine={machines[4]} />
                        <CurrentOp machine={machines[4]} />
                    </div>
                }
            
            </div>
            <div className='IntcodeMachine'>
                <p>Outputs: {output && output}</p>
                <button onClick={debugControls.doStep!}>Step</button>
            </div>
        </>
    }
    return null;

}

export default LotsOfMachines;