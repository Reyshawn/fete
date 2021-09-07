import React from 'react';
import logo from './logo.svg';
import './App.css';

import User from './components/user'
import SvgAni from './components/svgAni/index'
import Rxjs from './components/rxjs/index'

import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route
} from "react-router-dom";


export const MyContext = React.createContext("theme");

function App(props: any) {

  const navEm = (<ul className="navigation">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/svg-animation">SVG</Link>
      </li>
      <li>
        <Link to="/rxjs-demo">RxJs</Link>
      </li>
    </ul>)

  return (
    <MyContext.Provider value={"ppp-theme-asda"}>
    <div className="App">
      <Router>
        <Switch>
          <Route path="/rxjs-demo">
            <Rxjs />
          </Route>
          <Route path="/svg-animation">
            <SvgAni />
          </Route>
          <Route path="/users">
            <User />
          </Route>
          <Route path="/">
            {navEm}
            <div className="logo">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
    </MyContext.Provider>
  );
}

export default App;
