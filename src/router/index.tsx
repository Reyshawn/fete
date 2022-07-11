import React from 'react'
import {
  Outlet,
  Link,
} from "react-router-dom";


const SvgAni  = React.lazy(() => import('../components/svgAni/index'))
const Rxjs  = React.lazy(() => import('../components/rxjs/index'))
const Animation  = React.lazy(() => import('../components/animation/index'))
const Welcome = React.lazy(() => import("../components/welcome"))
const Fetch = React.lazy(() => import('../components/fetch'))


function Layout(props: any) {
  return (
    <div>
      <ul className="navigation">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="welcome">Welcome</Link>
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
        <li>
          <Link to="fetch">Fetch</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}

function Suspense({ children }: { children: JSX.Element }) {
  return (<React.Suspense fallback={<>...</>}>
    {children}
  </React.Suspense>)
}


const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'welcome',
        element: <Suspense><Welcome /></Suspense>
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
