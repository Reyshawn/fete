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

  const loader02 = (<svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="loader-02">
  <g transform="rotate(0 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
     {/*  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(30 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(60 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(90 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(120 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(150 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(180 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(210 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(240 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(270 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(300 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate> */}
    </rect>
  </g><g transform="rotate(330 50 50)">
    <rect x="47.5" y="4" rx="1.8" ry="1.8" width="5" height="18" fill="#fe718d">
      {/* <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate> */}
    </rect>
  </g>
  </svg>)

  return (
    <div className="svg-ani">
      <h1>SVG Animation</h1>
      <div className="loaders">
        {loader01}
        {loader02}
      </div>
    </div>
  )
}