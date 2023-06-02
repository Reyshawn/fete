import React from 'react';
// import logo from './logo.svg';
import styles from './App.module.css';
import routes from './router';
import { useRoutes } from 'react-router-dom';


export const MyContext = React.createContext("theme");


function App(props: any) {
  const appRoutes = useRoutes(routes)

  return (
    <MyContext.Provider value={"ppp-theme-asda"}>
    <div className={styles.App}>
      {appRoutes}
    </div>
    </MyContext.Provider>
  );
}


export default App;
