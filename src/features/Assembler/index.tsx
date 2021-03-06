import React, { useState, useEffect } from "react";
import "./assembler.css";
import {assemble } from '../IntcodeMachine/assembler';

const useDisassemble = (input: string) => {
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    assemble(input)
      .then((output: string) => {
        setOutput(output);
      });
  }, [input]) 

  return output;
}

export const Assembler = () => {
  const [input, setInput] = useState<string>('');
  const [savedInput, setSavedInput] = useState<string>('');
  const output = useDisassemble(savedInput);

  const assemble = () => {
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
      <button onClick={assemble} className="invert">
        Assemble
      </button>
    </>
  );
};
