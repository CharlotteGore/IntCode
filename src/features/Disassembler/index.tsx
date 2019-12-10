import React, { useState, useEffect } from "react";
import "./assembler.css";
import { disassemble } from '../IntcodeMachine/dissassembler';

const useDisassemble = (input: string) => {
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    disassemble(input)
      .then(result => {
        setOutput(result);
      });
  }, [input]) 

  return output;
}

export const Disassembler = () => {
  const [input, setInput] = useState<string>('');
  const [savedInput, setSavedInput] = useState<string>('');
  const output = useDisassemble(savedInput);

  const disassemble = () => {
    setSavedInput(input);
  }

  return (
    <>
      <div className="Assembler">
        <textarea
          onChange={e => setInput(e.target.value)}
          value={input}
        ></textarea>
        <textarea readOnly className="out" value={output}></textarea>
      </div>
      <button onClick={disassemble} className="invert">
        Disassemble
      </button>
    </>
  );
};
