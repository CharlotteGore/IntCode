import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import "./day.css";

import { useSolver } from "./hooks";

export const Day = () => {
  const { day, star } = useParams();
  const canvas = useRef<HTMLCanvasElement>(null);
  const { output } = useSolver(day || "day8", star || "1", canvas);

  return (
    <>
      <div className="IntcodeMachine">{output}</div>
      {day === "8" && star === "2" && (
        <canvas ref={canvas} width="25" height="6" />
      )}
    </>
  );
};
