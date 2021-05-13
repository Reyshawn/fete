import React from 'react'
import './style.css'

export default function SvgAni (props: any) {

  const loader01 = (<svg version="1.1" id="L3" x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 0 0">
    <circle fill="none" stroke="#000" stroke-width="4" cx="50" cy="50" r="44" style={{opacity: 0.5}} />
      <circle fill="#fff" stroke="#e74c3c" stroke-width="3" cx="8" cy="54" r="6" >
        <animateTransform
          attributeName="transform"
          dur="8s"
          type="rotate"
          from="0 50 48"
          to="360 50 52"
          repeatCount="indefinite" />
      </circle>
    </svg>
  )

  return (
    <div className="svg-ani">
      <h1>SVG Animation</h1>
      <div className="loaders">
        {loader01}
      </div>
    </div>
  )
}