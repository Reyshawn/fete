import { useContext, /* createContext */ } from 'react'

import {
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";

import { MyContext } from '../App' 

export default function User (props: any) {

  let { path, url } = useRouteMatch();

  const value = useContext(MyContext);

  return (<div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Switch>
      <Route exact path={path}>
        <h3>Please select a topic.</h3>
      </Route>
      <Route path={`${path}/:topicId`}>
        this is path: {path} 
        context value: {value}
      </Route>
    </Switch>
  </div>)
}