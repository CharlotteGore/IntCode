import React from 'react'

import { OPCODE, PARAM, MODE } from "./intcode-runner";
import { DebugStateUpdate } from "./intcode-debugger";

const Params = (props: { machine: DebugStateUpdate}) => {
    const { machine } = props;
    if (machine !== null) {
        const { pc, op, modes, program } = machine;
        let params = [];
        switch (op) {
            case OPCODE.ADD:
            case OPCODE.MUL:
            case OPCODE.JLT:
            case OPCODE.JPE:
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    params.push(<li key={0}>P1: ${program[pc +1]} (<span>{program[program[pc +1]]}</span>)</li>)
                } else {
                    params.push(<li key={0}>P1: <span>{program[pc +1]}</span></li>)
                }
                
                if (modes[PARAM.TWO] === MODE.POSITION) {
                    params.push(<li key={1}>P2: ${program[pc +2]} (<span>{program[program[pc +2]]}</span>)</li>)
                } else {
                    params.push(<li key={1}>P2: <span>{program[pc +2]}</span></li>)
                }

                params.push(<li key={2}>P3: <span>${program[pc +3]}</span> ({program[program[pc +3]]})</li>)
                break;
            case OPCODE.JPT:
            case OPCODE.JPF:
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    params.push(<li key={0}>P1: ${program[pc +1]} (<span>{program[program[pc +1]]}</span>)</li>)
                } else {
                    params.push(<li key={0}>P1: <span>{program[pc +1]}</span></li>)
                }
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    params.push(<li key={1}>P2: ${program[pc +2]} (<span>{program[program[pc +2]]}</span>)</li>)
                } else {
                    params.push(<li key={1}>P2: <span>${program[pc +2]}</span> ({program[program[pc +2]]})</li>)
                }
                params.push(<li key={2}>P3: - (-)</li>);
                break;
            case OPCODE.WRI:
            case OPCODE.REA:
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    params.push(<li key={0}>P1: ${program[pc +1]} (<span>{program[program[pc +1]]}</span>)</li>)
                } else {
                    params.push(<li key={0}>P1: <span>{program[pc +1]}</span></li>)
                }
                params.push(<li key={1}>P2: - (-)</li>);
                params.push(<li key={2}>P3: - (-)</li>);
                break;
            default:
                params.push(<li key={0}>P1: - (-)</li>);
                params.push(<li key={1}>P2: - (-)</li>);
                params.push(<li key={2}>P3: - (-)</li>);
        }

        return <ul className='Params'>
            { [...params] }
        </ul>
    }
    return null;
}

export default Params;