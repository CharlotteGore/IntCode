import React from 'react'

import { OPCODE, PARAM, MODE } from "./intcode-runner";
import { DebugStateUpdate } from "./intcode-debugger";

const ProgramDump = (props: { machine: DebugStateUpdate}) => {
    const { machine } = props;
    if (machine !== null) {
        const { pc, op, modes, program } = machine;

        let highlight: Array<number> = [];
        let reads: Array<number> = []
        let write = -1;
        let result = [];
        switch (op) {
            case OPCODE.ADD:
            case OPCODE.MUL:
            case OPCODE.JLT:
            case OPCODE.JPE:
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    highlight.push(pc + 1);
                    reads.push(program[pc + 1]);
                } else {
                    highlight.push(pc + 1);
                }
                
                if (modes[PARAM.TWO] === MODE.POSITION) {
                    highlight.push(pc + 2);
                    reads.push(program[pc + 2]);
                } else {
                    highlight.push(pc + 2);
                }
                write = pc + 3

                break;
            case OPCODE.JPT:
            case OPCODE.JPF:
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    highlight.push(pc + 1);
                    reads.push(program[pc + 1]);
                } else {
                    highlight.push(pc + 1);
                }
                write = pc + 2
                break;
            case OPCODE.WRI:
                write = pc + 1;
                break;     
            case OPCODE.REA:
                if (modes[PARAM.ONE] === MODE.POSITION) {
                    highlight.push(pc + 1);
                    reads.push(program[pc + 1]);
                } else {
                    highlight.push(pc + 1);
                }
                break;
            default:
                break;
        }

        for (let i = 0; i < program.length; i++) {
        result.push(<p key={i}><span className={i === pc && op !== OPCODE.NOP ? 'glow': ''}>{i}</span>: <span className={i === write ? 'write' : reads.includes(i) ? 'read' : (highlight.includes(i) ? 'glow' : '')}>{program[i]}</span></p>)
        }

        return <div className='ProgramDump'>
            { [...result ]}
        </div>;
    }
    return null;
}

export default ProgramDump;