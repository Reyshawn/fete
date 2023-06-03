import React from 'react'
import {
  Outlet,
  Link,
} from "react-router-dom";
import styles from '../App.module.css'


const DSwitch = React.lazy(() => import('../components/DSwitch/index'))
const DDropdown = React.lazy(() => import('../components/DDropdown/index'))
const DScrollpicker = React.lazy(() => import('../components/DScrollpicker/index'))
const SvgAni  = React.lazy(() => import('../components/svgAni/index'))
const Rxjs  = React.lazy(() => import('../components/rxjs/index'))
const Animation  = React.lazy(() => import('../components/animation/index'))
const Fetch = React.lazy(() => import('../components/fetch'))


function Layout(props: any) {
  return (
    <>
      <div className={styles.header}>
        <span className={styles["header-title"]}>
          Demoo
        </span>
        <ul className={styles.navigation}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="components">Components</Link>
          </li>
          <li>
            <Link to="animations">Animations</Link>
          </li>
          <li>
            <Link to="solutions">Solutions</Link>
          </li>
          <li>
            <Link to="topics">Topics</Link>
          </li>
        </ul>
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
    </>
  )
}


function SidebarLayout(props: any) {
  return (
    <div className={styles["siderbar-container"]}>
      <nav className={styles.sidebar}>
        <ul>
          {
            props.routes.map((r: any, index: number) => {
              return <li key={index}>
                <Link to={r.path}>{r.path}</Link>
              </li>
            })
          }
        </ul>
      </nav>
      <section className={styles["sidebar-main"]}>
        <Outlet />
      </section>
    </div>
  )
}


function Suspense({ children }: { children: JSX.Element }) {
  return (<React.Suspense fallback={<>...</>}>
    {children}
  </React.Suspense>)
}


const componentsRoutes = [
  {
    path: 'switch',
    element: <Suspense><DSwitch /></Suspense>
  },
  {
    path: 'dropdown',
    element: <Suspense><DDropdown /></Suspense>
  },
  {
    path: 'scrollpicker',
    element: <Suspense><DScrollpicker /></Suspense>
  }
]


const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'components',
        element: <Suspense><SidebarLayout routes={componentsRoutes} /></Suspense>,
        children: componentsRoutes
      },
      {
        path: 'svg',
        element: <Suspense><SvgAni /></Suspense>
      },
      {
        path: 'rxjs',
        element: <Suspense><Rxjs /></Suspense>
      },
      {
        path: 'animation',
        element: <Suspense><Animation /></Suspense>
      },
      {
        path: 'fetch',
        element: <Suspense><Fetch /></Suspense>
      }
    ]
  }
]

export default routes
