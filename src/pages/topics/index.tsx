import React from 'react'

export const ThreeJSPage = React.lazy(() => import("./ThreeJSPage/index"))
export const RxJSPage = React.lazy(() => import("./RxJSPage/index"))

export default function TopicsPage(props: any) {
  return (
    <>
      this is topics page
    </>
  )
}