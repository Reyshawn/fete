import React, { useCallback, useState } from 'react'
import {
  Outlet,
  Link,
  useLocation,
  NonIndexRouteObject
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
  DDatePickerPage,
  DColorPickerPage
} from '@/pages/components/index'

import {
  ListAnimationPage
} from "@/pages/animations/index"


import {
  ThreeJSPage,
  RxJSPage
} from '@/pages/topics/index'

import {
  Menus as ThreeJSMenus
} from '@/pages/topics/ThreeJSPage/index'

import ArrowRightIcon from '@/assets/svg/dp_arrow_right.svg'

import styles from '../App.module.css'


const SvgAni  = React.lazy(() => import('../components/svgAni/index'))
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


function MenuItem(props: {menu: Menu}) {
  const [expanded, setExpanded] = useState(true)

  const r = props.menu
  const location = useLocation()

  const toggle = useCallback(() => {
    setExpanded(e => !e)
  }, [])

  return <li className={location.pathname.endsWith("/" + r.path) ? styles.selected : undefined}>
    <div className={styles['menu-item']}>
      <Link to={r.path!}>{r.path}</Link>
      {r._subpages && <ArrowRightIcon onClick={toggle} style={{
        transform: expanded ? "rotate(90deg)" : undefined
      }} />}
    </div>
    { r._subpages && <ul style={{
      height: expanded ? (r._subpages.length * 20) + 'px' : 0
    }}>
      {
        r._subpages.map((sub, index) => {
          return <li
            className={location.pathname.endsWith("/" + sub.name) ? styles.selected : undefined}
            key={r.path! + '/' + sub.name}>
              <Link to={r.path! + '/' + sub.name} >{sub.name}
            </Link>
          </li>
        })
      }
    </ul>}
  </li>  
}


function SidebarLayout(props: {menus: Menu[]}) {
  return (
    <div className={styles["siderbar-container"]}>
      <nav className={styles.sidebar}>
        <ul>
          {
            props.menus.map((r, index) => {
              return <MenuItem menu={r} key={index}/>
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
  },
  {
    path: 'colorpicker',
    element: <Suspense><DColorPickerPage /></Suspense>
  }
]


interface Menu extends NonIndexRouteObject {
  _subpages?: {
    name: string
    element: JSX.Element
  }[]
}


const topicsMenus: Menu[] = [
  {
    path: '',
    element: <Suspense><TopicsPage /></Suspense>
  },
  {
    path: 'threejs',
    element: <Suspense><ThreeJSPage /></Suspense>,
    _subpages: ThreeJSMenus
  },
  {
    path: 'rxjs',
    element: <Suspense><RxJSPage /></Suspense>
  }
]


const animationsRoutes: Menu[] = [
  {
    path: '',
    element: <Suspense><AnimationsPage /></Suspense>
  },
  {
    path: 'list',
    element: <Suspense><ListAnimationPage /></Suspense>,
  },
]


function convertToRoutes(menus: Menu[]) {
  return menus.reduce<NonIndexRouteObject[]>((accu, curr) => {

    if (curr._subpages != null && curr._subpages.length > 0) {
      
      accu.push({
        path: curr.path,
        element: curr.element
      })
      
      const routes = curr._subpages.map(i => ({
        path: curr.path + '/' + i.name,
        element: i.element
      }))


      return accu.concat(routes as NonIndexRouteObject)
    }

    accu.push(curr)
    return accu
  }, [])
}


const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'components',
        element: <Suspense><SidebarLayout menus={componentsRoutes.filter(r => r.path !== '')} /></Suspense>,
        children: componentsRoutes
      },
      {
        path: 'animations',
        element: <Suspense><SidebarLayout menus={animationsRoutes.filter(r => r.path !== '')} /></Suspense>,
        children: animationsRoutes
      },
      {
        path: 'solutions',
        element: <Suspense><SolutionsPage /></Suspense>
      },
      {
        path: 'topics',
        element: <Suspense><SidebarLayout menus={topicsMenus.filter(r => r.path !== '')} /></Suspense>,
        children: convertToRoutes(topicsMenus)
      }
    ]
  }
]

export default routes
