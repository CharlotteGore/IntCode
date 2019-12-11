import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import "./day.css";

import { useSolver } from "./hooks";

export const Day = () => {
  const { day, star } = useParams();
  const canvas = useRef<HTMLCanvasElement>(null);
  const { output, isProcessing } = useSolver(
    day || "day1",
    star || "1",
    canvas
  );

  return (
    <>
      <div className="IntcodeMachine">
        {isProcessing ? "processing..." : output}
      </div>
      {day === "8" || (day === "11" && star === "2" && <canvas ref={canvas} />)}
    </>
  );
};
