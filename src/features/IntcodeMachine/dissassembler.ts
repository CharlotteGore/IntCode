import programs from './programs';
import { OPCODE, MODE, PARAM } from './intcode-runner';
import parse from './intcode-parser';
import { number } from 'prop-types';
import { reject } from 'q';

export const disassemble = (input: string) => {
    return new Promise<string>((resolve) => {
        debugger;
        if (input === '') return resolve('');
        const program = parse(input);
        let pc = 0;
        let str = '';
    
        let mode = {
            [PARAM.ONE]: MODE.POSITION,
            [PARAM.TWO]: MODE.POSITION,
            [PARAM.THREE]: MODE.POSITION,
        }
    
        const getParam = (param: PARAM) => {
            if (mode[param] === MODE.IMMEDIATE) {
                return program[pc + param].toString();
            } else if (mode[param] == MODE.POSITION) {
                return `$${program[pc + param]}`;
            } else if (mode[param] === MODE.RELATIVE) {
                return `*${program[pc + param]}`;
            }
        }
    
        while(pc < program.length) {
            let op: OPCODE | null;
            let inst = program[pc];
    
            let p3 = ~~(inst / 10000);
            op = inst - p3 * 10000;
            let p2 = ~~(op / 1000);
            op = op - p2 * 1000;
            let p1 = ~~(op / 100);
            op = op - p1 * 100;
    
            mode[PARAM.ONE] = p1;
            mode[PARAM.TWO] = p2;
            mode[PARAM.THREE] = p3;
    
            switch (op) {
                case OPCODE.ADD:
                case OPCODE.MUL:
                case OPCODE.JLT:
                case OPCODE.JPE:
                    str += `${OPCODE[op]} ${getParam(PARAM.ONE)} ${getParam(PARAM.TWO)} ${getParam(PARAM.THREE)}\n`
                    pc += 4;
                    break;
                case OPCODE.JPT:
                case OPCODE.JPF:
                    str += `${OPCODE[op]} ${getParam(PARAM.ONE)} ${getParam(PARAM.TWO)}\n`
                    pc += 3;
                    break;
                case OPCODE.WRI:
                case OPCODE.REA:
                case OPCODE.SFT:
                    str += `${OPCODE[op]} ${getParam(PARAM.ONE)}\n`
                    pc += 2;    
                    break;
                case OPCODE.NOP:
                case OPCODE.HCF:
                    str += `${OPCODE[op]}\n`
                    pc += 1;
                    break;
                default:
                    break;
                
            }
        }
        
        return resolve(str);
    })
    

}