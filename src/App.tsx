import React from 'react';
// import logo from './logo.svg';
import './App.css';

import SvgAni from './components/svgAni/index'
import Rxjs from './components/rxjs/index'
import Animation from './components/animation/index'

import {
  Outlet,
  BrowserRouter,
  Link,
  Routes,
  Route
} from "react-router-dom";


export const MyContext = React.createContext("theme");

function App(props: any) {

  return (
    <MyContext.Provider value={"ppp-theme-asda"}>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="svg" element={<SvgAni />} />
            <Route path="rxjs" element={<Rxjs />} />
            <Route path="animation" element={<Animation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
    </MyContext.Provider>
  );
}


function Layout(props: any) {
  return (
    <div>
      <ul className="navigation">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="svg">SVG</Link>
        </li>
        <li>
          <Link to="rxjs">RxJs</Link>
        </li>
        <li>
          <Link to="animation">Animation</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}

export default App;
