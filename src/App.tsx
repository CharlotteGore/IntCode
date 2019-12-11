import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./features/Home";
import { Day } from "./features/Day";
import { DebuggerPortal } from "./features/DebuggerPortal";
import { Assembler } from "./features/Assembler";
import { Disassembler } from "./features/Disassembler";

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/day/1/1">1:1</Link>
            </li>
            <li>
              <Link to="/day/1/2">1:2</Link>
            </li>
            <li>
              <Link to="/day/2/1">2:1</Link>
            </li>
            <li>
              <Link to="/day/2/2">2:2</Link>
            </li>
            <li>
              <Link to="/day/3/1">3:1</Link>
            </li>
            <li>
              <Link to="/day/3/2">3:2</Link>
            </li>
            <li>
              <Link to="/day/4/1">4:1</Link>
            </li>
            <li>
              <Link to="/day/4/2">4:2</Link>
            </li>
            <li>
              <Link to="/day/5/1">5:1</Link>
            </li>
            <li>
              <Link to="/day/5/2">5:2</Link>
            </li>
            <li>
              <Link to="/day/6/1">6:1</Link>
            </li>
            <li>
              <Link to="/day/6/2">6:2</Link>
            </li>
            <li>
              <Link to="/day/7/1">7:1</Link>
            </li>
            <li>
              <Link to="/day/7/2">7:2</Link>
            </li>
            <li>
              <Link to="/day/8/1">8:1</Link>
            </li>
            <li>
              <Link to="/day/8/2">8:2</Link>
            </li>
            <li>
              <Link to="/day/9/1">9:1</Link>
            </li>
            <li>
              <Link to="/day/9/2">9:2</Link>
            </li>
            <li>
              <Link to="/day/10/1">10:1</Link>
            </li>
            <li>
              <Link to="/day/10/2">10:2</Link>
            </li>
            <li>
              <Link to="/day/11/1">11:1</Link>
            </li>
            <li>
              <Link to="/day/11/2">11:2</Link>
            </li>
            <li>
              <Link to="/day/12/1">12:1</Link>
            </li>
            <li>
              <Link to="/day/12/2">12:2</Link>
            </li>
            <li>
              <Link to="/intcode">Debugger</Link>
            </li>
            <li>
              <Link to="/assembler">Assembler</Link>
            </li>
            <li>
              <Link to="/disassembler">Disassembler</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/day/:day/:star" children={<Day />} />
          <Route path="/intcode" children={<DebuggerPortal />} />
          <Route path="/assembler" children={<Assembler />} />
          <Route path="/disassembler" children={<Disassembler />} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
