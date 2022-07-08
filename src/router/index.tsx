import React from 'react'
import {
  Outlet,
  Link,
} from "react-router-dom";


const SvgAni  = React.lazy(() => import('../components/svgAni/index'))
const Rxjs  = React.lazy(() => import('../components/rxjs/index'))
const Animation  = React.lazy(() => import('../components/animation/index'))


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

function Suspense({ children }: {children: any}) {
  return (<React.Suspense fallback={<>...</>}>
    {children}
  </React.Suspense>)
}


export default [
  {
    path: '/',
    element: <Layout />,
    children: [
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
      }
    ]
  }
]
