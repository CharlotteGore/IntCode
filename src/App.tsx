import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./features/Home";
import { Day } from "./features/Day";
// import { DebuggerPortal } from "./features/DebuggerPortal";
import { Assembler } from "./features/Assembler";
import { Disassembler } from "./features/Disassembler";
import { DebuggerPortal } from "./features/DebuggerPortal";

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
              <Link to="/day/13/1">13:1</Link>
            </li>
            <li>
              <Link to="/day/13/2">13:2</Link>
            </li>
            <li>
              <Link to="/day/14/1">14:1</Link>
            </li>
            <li>
              <Link to="/day/14/2">14:2</Link>
            </li>
            <li>
              <Link to="/day/15/1">15:1</Link>
            </li>
            <li>
              <Link to="/day/15/2">15:2</Link>
            </li>
            <li>
              <Link to="/day/16/1">16:1</Link>
            </li>
            <li>
              <Link to="/day/16/2">16:2</Link>
            </li>
            <li>
              <Link to="/day/17/1">17:1</Link>
            </li>
            <li>
              <Link to="/day/17/2">17:2</Link>
            </li>
            <li>
              <Link to="/day/18/1">18:1</Link>
            </li>
            <li>
              <Link to="/day/18/2">18:2</Link>
            </li>
            <li>
              <Link to="/day/19/1">19:1</Link>
            </li>
            <li>
              <Link to="/day/19/2">19:2</Link>
            </li>
            <li>
              <Link to="/day/20/1">20:1</Link>
            </li>
            <li>
              <Link to="/day/20/2">20:2</Link>
            </li>
            <li>
              <Link to="/day/21/1">21:1</Link>
            </li>
            <li>
              <Link to="/day/21/2">21:2</Link>
            </li>
            <li>
              <Link to="/day/22/1">22:1</Link>
            </li>
            <li>
              <Link to="/day/22/2">22:2</Link>
            </li>
            <li>
              <Link to="/day/23/1">23:1</Link>
            </li>
            <li>
              <Link to="/day/23/2">23:2</Link>
            </li>
            <li>
              <Link to="/day/24/1">24:1</Link>
            </li>
            <li>
              <Link to="/day/24/2">24:2</Link>
            </li>
            <li>
              <Link to="/day/25/1">25:1</Link>
            </li>
            <li>
              <Link to="/day/25/2">25:2</Link>
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
            <li>
              <Link to="/day/17-2018/1">17 (2018):1</Link>
            </li>
            <li>
              <Link to="/day/17-2018/2">17 (2018):2</Link>
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
