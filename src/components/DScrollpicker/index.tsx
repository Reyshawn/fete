import React, { useMemo, useRef, useState, useCallback, useEffect } from "react"
import style from "./style.module.css"

import { useDraggable } from "@/utils/useDraggable"
import animate from "@/utils/animate"

interface DScrollpickerProps {
  options: String[]
  value: string
  config?: {
    height?: number
    wheelCount?: number
  }
}


export default function DScrollpicker(props: DScrollpickerProps) {
  const itemHeight = props.config?.height || 36
  const wheelCount = props.config?.wheelCount || 20
  const acceleration = 5

  const itemAngle = useMemo(() => 360 / wheelCount, [wheelCount])
  const radius = useMemo(() => itemHeight / (2 * Math.sin(itemAngle * Math.PI / 360)), [itemHeight, itemAngle])
  const halfWheelCount = useMemo(() => wheelCount / 2, [wheelCount])

  // const [scroll, setScroll] = useState(0)
  
  const picker = useRef<HTMLDivElement>(null)

  // const isDragging = useRef(false)
  // const draggingStatus = useRef({y: 0})
  // const scrollLocations = useRef<[number, number][]>([])
  const startScroll = useRef(0)
  const rafId = useRef<number | null>(null)
  // const isAnimationInProgress = useRef(false)

  // const scrollStopTimer = useRef<NodeJS.Timeout | null>(null)

  const cssVars: React.CSSProperties = {
    ['--item-height' as any]: itemHeight + 'px',
    'height': `${2 * radius}px`
  }


  const status = useDraggable(picker, {
    onDragEnd: (status) => {

      // animate to the final scroll
      startScroll.current = startScroll.current + (-status.dy) / itemHeight
  }})

  const scroll = startScroll.current + (-status.dy) / itemHeight

  return (
    <div
      className={style["d-picker"]}
      style={cssVars}
      ref={picker}>
      <div className={style["d-picker-wheel"]}>
        <div
          className={style["d-picker-wheel-rotate"]}
          style={{
            'transform': `rotateX(${-1 * itemAngle * scroll}deg)`
          }}>
        {
          props.options.map((option, i) => {
            return (
              <div
                key={"wh_" + i}
                className={style["d-picker-wheel-item"]}
                style={{
                  'transform': `rotateX(${i * itemAngle}deg) translateZ(-${radius}px)`,
                  'visibility': Math.abs(i - Math.round(scroll)) > halfWheelCount ? 'hidden' : 'visible'
                }}>
                {option}
              </div>
            )
          })
        }
        </div>
        
      </div>
      <div className={style["d-picker-board"]}>
        <div
          className={style["d-picker-board-transform"]}
          style={{
            'transform': `translateY(${-1 * itemHeight * scroll}px)`
          }}>
        {
          props.options.map((option, index) => {
            return (
              <div
                key={"board_" + index}
                className={style["d-picker-board-option"]}>{option}</div>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}
