import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Home from './features/Home';
import IntcodeMachine from './features/IntcodeMachine';
import LotsOfMachines from "./features/IntcodeMachine/LotsOfMachines";

const App = () => {
  return <Router>
  <div className='App'>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/intcode/day2">Day 2</Link>
        </li>
        <li>
          <Link to="/intcode/day5">Day 3</Link>
        </li>
        <li>
          <Link to="/paralleldemo">Day 7</Link>
        </li>
      </ul>
    </nav>

    {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
    <Switch>
      <Route path="/intcode/:id" children={<IntcodeMachine />} />
      <Route path="/paralleldemo" children={<LotsOfMachines input={[5, 6, 7, 8, 9]} />} />
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </div>
</Router>
}

export default App;
