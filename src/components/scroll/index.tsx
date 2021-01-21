import React from 'react'
import { disableBodyScroll } from 'body-scroll-lock';

import './style.css'
function Scroll (props: any) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const em = React.useRef<HTMLDivElement>(null)

  const listEms = Array.from({length: 100}, (d, idx) => <li key={'item_' + idx}>items {idx}</li>)

  React.useEffect(() => {
    disableBodyScroll(em.current as HTMLElement)
    disableBodyScroll(document.documentElement)
    disableBodyScroll(document.body)
  });

  // const onMousemoveHandler = () => {
  //   return (event: Event) => {
  //     event.preventDefault()
  //   }
  // }

  
  console.log('listEms', listEms)
  return <div className="app" ref={em}>
    <div style={{marginTop: '3rem'}}></div>
    <div className="indicator">{scrollTop}</div>
    <div className="banner">
      <h1>Hello, scroll</h1>
    </div>
    <div className="content-wrapper">
      <ul>{listEms}</ul>
    </div>
    <div className="footer">
      <p>This is footer</p>
      <input type="text"/>
    </div>
  </div>
}

export default Scroll