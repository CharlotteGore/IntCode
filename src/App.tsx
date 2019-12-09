import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./features/Home";
import { Day } from "./features/Day";
import { DebuggerPortal } from "./features/DebuggerPortal";
import { Assembler } from "./features/Assembler";

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
              <Link to="/day/1/1">1:2</Link>
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
              <Link to="/intcode">Debugger</Link>
            </li>
            <li>
              <Link to="/assembler">Assembler</Link>
            </li>
            <li>
              <Link to="/day/experiment/1">Experiment</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/day/:day/:star" children={<Day />} />
          <Route path="/intcode" children={<DebuggerPortal />} />
          <Route path="/assembler" children={<Assembler />} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
