import React, { useState } from "react";
import "./assembler.css";
import { OPCODE, MODE } from "../IntcodeMachine/intcode-runner";
import { toLines } from "../Helpers/parsers";

/*
:entrance
def a
def b
def c

rea a
:start
add 1 1 a ;must always write to a var
add a 1 b ;position mode
add 1 b c ;one pos, one immediate
add a b c ;one pos, one immediate
mul a b c ;
jpf a end
hcf ; ends program
:something
jpt 0 start
wri a; causes output
wri 4; causes output
rea a; must always read to variable
jlt a 1 end
jpe 1 b start
:end
hcf

*/

export const Assembler = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const assemble = () => {
    // pass one - identify all the defines first...
    const lines = toLines(input);

    const { defs, rest } = lines.reduce(
      (data: { defs: Array<string>; rest: Array<string> }, m: string) => {
        let match = m.match(/def ([a-zA-Z]+)/);
        if (match !== null) {
          data.defs.push(match[1]!);
        } else {
          if (m !== "") {
            data.rest.push(m);
          }
        }
        return data;
      },
      { defs: [], rest: [] }
    );

    const { blocks } = rest
      .join("\n")
      .split(/:([a-z]+)/)
      .reduce(
        (
          data: {
            blocks: Array<{ id: string | null; lines: Array<string> }>;
            lastBlockId: string | null;
          },
          sectionIdOrCode: string,
          index: number
        ) => {
          if (index % 2 === 0 && sectionIdOrCode !== "") {
            // even id, which means a code block.
            data.blocks.push({
              id: data.lastBlockId,
              lines: toLines(sectionIdOrCode).filter(m => m !== "")
            });
          } else {
            // odd id, which means a block identifier
            data.lastBlockId = sectionIdOrCode;
          }
          return data;
        },
        { blocks: [], lastBlockId: null }
      );

    const blockNames = blocks.map(block => block.id);

    const isNumber = (s: string) => /^[\d-]+$/.test(s);
    const parseParam = (s: string) => {
      if (isNumber(s)) {
        return { val: parseInt(s, 10), defs: null, loc: null };
      } else if (defs.includes(s)) {
        return { defs: defs.indexOf(s), val: null, loc: null };
      } else if (blockNames.includes(s)) {
        return { defs: null, val: null, loc: blockNames.indexOf(s) };
      } else {
        return null;
      }
    };

    let faultFound = false;
    const tokenized = blocks.map(block => {
      return block.lines.map(line => {
        const match = line.match(/^(add|mul|rea|wri|jpt|jpf|jlt|jpe|hcf)/);
        if (match !== null) {
          // eslint-disable-next-line
          const [_, p1, p2, p3] = line
            .split(/;/)[0]
            .trim()
            .split(/\s/g);
          let p1m = MODE.POSITION;
          let p2m = MODE.POSITION;
          let p3m = MODE.POSITION;
          const op = match[1].toLowerCase();
          switch (op) {
            case "mul":
            case "add": {
              const p1v = parseParam(p1);
              if (p1v === null) {
                setOutput(`Invalid param ${p1} ${line}`);
                faultFound = true;
                return null;
              }
              if (p1v.val !== null) p1m = MODE.IMMEDIATE;
              const p2v = parseParam(p2);
              if (p2v === null) {
                setOutput(`Invalid param ${p2} ${line}`);
                faultFound = true;
                return null;
              }
              if (p2v.val !== null) p2m = MODE.IMMEDIATE;
              const p3v = parseParam(p3);
              if (p3v === null) {
                setOutput(`Invalid param ${p3} ${line}`);
                faultFound = true;
                return null;
              }
              if (p3v.defs === null) {
                setOutput(`write params must be to defines ${p3} ${line}`);
                faultFound = true;
                return null;
              }
              return {
                op: op === "add" ? OPCODE.ADD : OPCODE.MUL,
                modes: [p1m, p2m, p3m],
                params: [p1v, p2v, p3v],
                size: 4
              };
            }
            case "rea":
            case "wri": {
              const p1v = parseParam(p1);
              if (p1v === null) {
                debugger;
                setOutput(`Invalid param ${p1} ${line}`);
                faultFound = true;
                return null;
              }
              if (p1v.val !== null) p1m = MODE.IMMEDIATE;

              if (op === "rea" && p1v.defs === null) {
                setOutput(`write params must be to defines ${p1} ${line}`);
                faultFound = true;
                return null;
              }
              return {
                op: op === "rea" ? OPCODE.REA : OPCODE.WRI,
                modes: [p1m, p2m, p3m],
                params: [p1v],
                size: 2
              };
            }
            case "jpt":
            case "jpf": {
              p2m = MODE.IMMEDIATE;
              const p1v = parseParam(p1);
              if (p1v === null) {
                setOutput(`Invalid param ${p1} ${line}`);
                faultFound = true;
                return null;
              }
              if (p1v.val !== null) p1m = MODE.IMMEDIATE;
              const p2v = parseParam(p2);
              if (p2v === null) {
                setOutput(`Invalid param ${p2} ${line}`);
                faultFound = true;
                return null;
              }
              if (p2v.loc === null) {
                setOutput(`jumps must go to defined locations ${p2} ${line}`);
                faultFound = true;
                return null;
              }
              return {
                op: op === "jpt" ? OPCODE.JPT : OPCODE.JPF,
                modes: [p1m, p2m, p3m],
                params: [p1v, p2v],
                size: 3
              };
            }
            case "jlt":
            case "jpe": {
              p3m = MODE.IMMEDIATE;
              const p1v = parseParam(p1);
              if (p1v === null) {
                setOutput(`Invalid param ${p1} ${line}`);
                faultFound = true;
                return null;
              }
              if (p1v.val !== null) p1m = MODE.IMMEDIATE;
              const p2v = parseParam(p2);
              if (p2v === null) {
                setOutput(`Invalid param ${p2} ${line}`);
                faultFound = true;
                return null;
              }
              if (p2v.val !== null) p2m = MODE.IMMEDIATE;
              const p3v = parseParam(p3);
              if (p3v === null) {
                setOutput(`Invalid param ${p3} ${line}`);
                faultFound = true;
                return null;
              }
              if (p3v.loc === null) {
                setOutput(`jumps must go to defined locations ${p3} ${line}`);
                faultFound = true;
                return null;
              }
              return {
                op: op === "jlt" ? OPCODE.JLT : OPCODE.JPE,
                modes: [p1m, p2m, p3m],
                params: [p1v, p2v, p3v],
                size: 4
              };
            }
            case "hcf":
              return {
                op: OPCODE.HCF,
                modes: [p1m, p2m, p3m],
                params: [],
                size: 1
              };
          }
        } else {
          setOutput(`invalid op code ${line}`);
        }
        return null;
      });
    });
    if (!faultFound) {
      let position = 0;
      const blockSizes = tokenized.map(block => {
        const size = block.reduce((sum, op) => {
          return sum + op!.size;
        }, 0);
        const o = {
          position: position,
          size: size
        };
        position += size;
        return o;
      });
      const lastBlock = blockSizes[blockSizes.length - 1];
      const codeSize = lastBlock.position + lastBlock.size;
      const code = tokenized.reduce((code: Array<number>, block) => {
        return code.concat(
          block.reduce((code: Array<number>, line) => {
            code.push(
              parseInt(
                (
                  line!.modes[2] * 100 +
                  line!.modes[1] * 10 +
                  line!.modes[0]
                ).toString() +
                  (line!.op < 10 ? "0" : "") +
                  line!.op.toString(),
                10
              )
            );
            for (let i = 0; i < line!.params.length; i++) {
              let inst = line!.params[i];
              if (inst.val !== null) {
                code.push(inst.val);
              } else if (inst.defs !== null) {
                code.push(codeSize + inst.defs);
              } else if (inst.loc !== null) {
                code.push(blockSizes[inst.loc].position);
              }
            }

            return code;
          }, [])
        );
      }, []);

      for (let i = 0; i < defs.length; i++) {
        code.push(0);
      }
      console.log(code);
      setOutput(code.join(","));
    }
  };

  return (
    <>
      <div className="Assembler">
        <textarea
          onChange={e => setInput(e.target.value)}
          value={input}
        ></textarea>
        <textarea readOnly className="out" value={output}></textarea>
      </div>
      <button onClick={assemble} className="invert">
        Assemble
      </button>
    </>
  );
};
