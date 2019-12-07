import React from 'react';
import {
    useParams
  } from "react-router-dom";
import './intcode.css';
import Params from './Params';
import CurrentOp from './CurrentOp';
import ProgramDump from './ProgramDump';
import { useMachine } from './hooks';


const IntcodeMachine = () => {
    const { id } = useParams()
    const {
        machineState,
        debugControls,
        output,
    } = useMachine(id);

    return <div className="IntcodeMachine">
        {
            machineState && debugControls && <>
                <h3>Machine ID: {id}</h3>
                <Params machine={machineState} />
                <p>Outputs: {output && output}</p>
                <CurrentOp machine={machineState} />
                <button onClick={debugControls.doStep!}>Step</button>
                <ProgramDump machine={machineState} />
            </>
        }
        
        
    </div>
}

export default IntcodeMachine;