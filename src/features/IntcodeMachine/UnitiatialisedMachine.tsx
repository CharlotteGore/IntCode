import React, { useState } from "react";
import "./intcode.css";
import { Machine, UninitialisedMachineType } from "./machine";

type Output = string;

const UninitialisedMachine = (props: {
  machine: Machine | UninitialisedMachineType;
  onSetOutput: (output: Output) => void;
  possibleOutputs: Array<Output>;
}) => {
  const {
    machine: {
      config: { id }
    },
    possibleOutputs
  } = props;
  const [selectVal, setSelectVal] = useState(possibleOutputs[0]);

  const handleConfirm = () => {
    props.onSetOutput(selectVal);
  };

  return (
    <div className="IntcodeMachine">
      {id && (
        <>
          <h3>Machine ID: {id} </h3>
          <h3>Not Running</h3>
          <select
            value={selectVal}
            onChange={e => setSelectVal(e.target.value)}
          >
            {possibleOutputs.map(o => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button onClick={handleConfirm}>[Boot]</button>
        </>
      )}
    </div>
  );
};

export default UninitialisedMachine;
