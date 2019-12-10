import {
  ParameterModes,
  IntcodeProgram,
  ProgramCounter,
  OPCODE,
  MODE,
  PARAM,
  RelativeBase
} from "./intcode-runner";
import produce from "immer";

export type DebugStateUpdate = {
  pc: ProgramCounter;
  op: OPCODE;
  rb: RelativeBase;
  modes: ParameterModes;
  program: IntcodeProgram;
  id: number;
  lastOutput: number | null;
};

export type UpdateCallback = (
  update: DebugStateUpdate,
  debug?: Debugger
) => void;

class Debugger {
  private _program: IntcodeProgram;
  private _pc: ProgramCounter;
  private _rb: RelativeBase;
  private _modes: ParameterModes;
  private _onFire: boolean;
  private _op: OPCODE;
  private paused: boolean;
  private breakpoints: Array<ProgramCounter>;
  private externalObservers: Array<UpdateCallback>;
  private _instanceId: number;
  private _lastOutput: number | null;

  private runNextStep: Function | null;

  constructor(instanceId: number, paused: boolean = true) {
    this._program = [];
    this._modes = {
      [PARAM.ONE]: MODE.POSITION,
      [PARAM.TWO]: MODE.POSITION,
      [PARAM.THREE]: MODE.POSITION
    };
    this._onFire = false;
    this._pc = 0;
    this._rb = 0;
    this._op = OPCODE.NOP;
    this.paused = paused;
    this._instanceId = instanceId;

    this.breakpoints = [];
    this.runNextStep = null;
    this._lastOutput = null;
    this.externalObservers = [];
  }
  set pc(pc: ProgramCounter) {
    this._pc = pc;
  }
  set rb(rb: RelativeBase) {
    this._rb = rb;
  }
  set op(op: OPCODE) {
    this._op = op;
  }
  set program(program: IntcodeProgram) {
    this._program = program;
  }
  set modes(modes: ParameterModes) {
    this._modes = modes;
  }
  set onFire(isOnFire: boolean) {
    console.log("debugger", this._instanceId, "is halting");
    this._onFire = isOnFire;
  }
  private async readyForNext(): Promise<boolean> {
    return new Promise(resolve => {
      this.runNextStep = () => {
        this.runNextStep = null;
        resolve(true);
      };
    });
  }
  addBreakpoint(pc: ProgramCounter) {
    if (!this.breakpoints.includes(pc)) {
      this.breakpoints = produce(this.breakpoints, draft => {
        draft.push(pc);
      });
    }
  }
  clearBreakpoint(pc: ProgramCounter) {
    if (this.breakpoints.includes(pc)) {
      this.breakpoints = produce(this.breakpoints, draft => {
        draft.splice(draft.indexOf(pc), 1);
      });
    }
  }
  step() {
    if (this.runNextStep) {
      this.runNextStep();
    }
  }
  pause() {
    this.paused = true;
  }
  run() {
    this.paused = false;
    if (this.runNextStep) {
      this.runNextStep();
    }
  }
  update() {
    this.externalObservers.forEach(f =>
      f({
        pc: this._pc,
        rb: this._rb,
        op: this._op,
        modes: this._modes,
        program: this._program,
        id: this._instanceId,
        lastOutput: this._lastOutput
      })
    );
  }
  onValue(value: number | null) {
    this._lastOutput = value;
  }
  onUpdate(fn: UpdateCallback) {
    this.externalObservers = produce(this.externalObservers, draft => {
      draft.push(fn);
    });
    this.update();
    return {
      cancel: () => {
        this.externalObservers = produce(this.externalObservers, draft => {
          draft.splice(draft.indexOf(fn), 1);
        });
      }
    };
  }
  async *control(): AsyncGenerator<boolean, boolean, boolean> {
    while (!this._onFire) {
      this.update();
      if (!this.paused && this.breakpoints.length === 0) {
        // no breakpoints, not paused - just run
        yield true;
      } else if (this.breakpoints.includes(this._pc)) {
        // not paused, but found a breakpoint.
        // wait for a step signal before continuing.
        yield await this.readyForNext();
      } else if (this.paused) {
        yield await this.readyForNext();
      }
    }
    return false;
  }
}

export default Debugger;
