import React from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome from './components/welcome';
import User from './components/user'
import SvgAni from './components/svgAni/index'

import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route
} from "react-router-dom";


export const MyContext = React.createContext("theme");

function App(props: any) {
  const [showResults, setShowResults] = React.useState(false)
  const onClick = () => {
    setShowResults(!showResults)
  }

  const navEm = (<ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/svg-animation">svg animation</Link>
      </li>
      <li>
        <Link to="/users">Dashboard</Link>
      </li>
    </ul>)

  return (
    <MyContext.Provider value={"ppp-theme-asda"}>
    <div className="App">
      <Router>
        <Switch>
          <Route path="/svg-animation">
            <SvgAni />
          </Route>
          <Route path="/users">
            <User />
          </Route>
          <Route path="/">
            {navEm}
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <button onClick={onClick}>show results</button>
              {showResults ? <Welcome name="ppp" /> : null}
              <Welcome name="ddd" /> 
              <Welcome name="eee" /> 
            </header>
          </Route>
        </Switch>
      </Router>
    </div>
    </MyContext.Provider>
  );
}

export default App;
