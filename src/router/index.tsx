import React from 'react'
import {
  Outlet,
  Link,
  useLocation
} from "react-router-dom";
import {
  ComponentsPage,
  AnimationsPage,
  SolutionsPage,
  TopicsPage
} from "../pages/index"

import {
  DSwitchPage,
  DScrollpickerPage,
  DDatePickerPage
} from '../pages/components/index'

import styles from '../App.module.css'


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
  const location = useLocation()

  return (
    <div className={styles["siderbar-container"]}>
      <nav className={styles.sidebar}>
        <ul>
          {
            props.routes.map((r: any, index: number) => {
              return <li key={index} className={location.pathname.endsWith("/" + r.path) ? styles.selected : undefined}>
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
    path: '',
    element: <Suspense><ComponentsPage /></Suspense>
  },
  {
    path: 'switch',
    element: <Suspense><DSwitchPage /></Suspense>
  },
  {
    path: 'scrollpicker',
    element: <Suspense><DScrollpickerPage /></Suspense>
  },
  {
    path: 'datepicker',
    element: <Suspense><DDatePickerPage /></Suspense>
  }
]


const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'components',
        element: <Suspense><SidebarLayout routes={componentsRoutes.filter(r => r.path !== '')} /></Suspense>,
        children: componentsRoutes
      },
      {
        path: 'animations',
        element: <Suspense><AnimationsPage /></Suspense>
      },
      {
        path: 'solutions',
        element: <Suspense><SolutionsPage /></Suspense>
      },
      {
        path: 'topics',
        element: <Suspense><TopicsPage /></Suspense>
      }
    ]
  }
]

export default routes
