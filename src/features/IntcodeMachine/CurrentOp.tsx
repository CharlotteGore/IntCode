import React from 'react'

import { OPCODE, PARAM, MODE } from "./intcode-runner";
import { DebugStateUpdate } from "./intcode-debugger";

const CurrentOp = (props: { machine: DebugStateUpdate}) => {
    const { machine } = props;
    if (machine !== null) {
        const { pc, op, modes, program } = machine;

        let rawStr: Array<number>;
        let assembled = OPCODE[op];
        switch (op) {
            case OPCODE.ADD:
            case OPCODE.MUL:
            case OPCODE.JLT:
            case OPCODE.JPE:
                rawStr = [program[pc], program[pc+1], program[pc+2], program[pc+3]];
                assembled = `${assembled} 
                    ${modes[PARAM.ONE] === MODE.POSITION ? '$' : ''}${program[pc + 1]} 
                    ${modes[PARAM.TWO] === MODE.POSITION ? '$' : ''}${program[pc + 2]} 
                    $${program[pc + 3]}`
                break;
            case OPCODE.JPT:
            case OPCODE.JPF:

                rawStr = [program[pc], program[pc+1], program[pc+2]];
                assembled = `${assembled} 
                    ${modes[PARAM.ONE] === MODE.POSITION ? '$' : ''}${program[pc + 1]} 
                    $${program[pc + 3]}`
                break;
            case OPCODE.WRI:
            case OPCODE.REA:
                rawStr = [program[pc], program[pc+1]];
                assembled = `${assembled} 
                    ${modes[PARAM.ONE] === MODE.POSITION ? '$' : ''}${program[pc + 1]}`
                break;
            case OPCODE.NOP:
                rawStr = [];
                assembled = `-`
                break;
            default:
                rawStr = [program[pc]];
        }

        return <div className='CurrentOp'>
            <span className='current-raw'>{rawStr.join(',')}</span> <span className='assembly'>{assembled}</span>

        </div>;
    }
    return null;
}

export default CurrentOp;