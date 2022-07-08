import {
  Outlet,
  Link,
} from "react-router-dom";

import SvgAni from '../components/svgAni/index'
import Rxjs from '../components/rxjs/index'
import Animation from '../components/animation/index'


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


export default [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'svg',
        element: <SvgAni />
      },
      {
        path: 'rxjs',
        element: <Rxjs />
      },
      {
        path: 'animation',
        element: <Animation />
      }
    ]
  }
]
