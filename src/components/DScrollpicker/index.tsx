import React, { useMemo, useRef, useState, useCallback, useEffect } from "react"
import style from "./style.module.css"

import { useDraggable } from "@/utils/useDraggable"
import { useInertiaAnimator } from "@/utils/useInertiaAnimator"

interface DScrollpickerProps {
  options: string[]
  value: string
  config?: {
    rowHeight?: number
    wheelCount?: number
    fontSize: string
    backgroundFontColor: string
  }
  onChange?: (value: string) => void
}


export default function DScrollpicker(props: DScrollpickerProps) {
  const itemHeight = props.config?.rowHeight || 36
  const wheelCount = props.config?.wheelCount || 20

  const itemAngle = useMemo(() => 360 / wheelCount, [wheelCount])
  const radius = useMemo(() => itemHeight / (2 * Math.sin(itemAngle * Math.PI / 360)), [itemHeight, itemAngle])
  const halfWheelCount = useMemo(() => wheelCount / 2, [wheelCount])

  const picker = useRef<HTMLDivElement>(null)
  const prevValue = useRef(props.value)

  const startScroll = useRef(props.options.findIndex(v => v === props.value))

  const cssVars: React.CSSProperties = useMemo(() => ({
    ['--item-height' as any]: itemHeight + 'px',
    ['--item-font-size' as any]: props.config?.fontSize,
    ['--item-background-font-color' as any]: props.config?.backgroundFontColor,
    'height': `${2 * radius}px`
  }), [])

  const calcScroll = useCallback((dy: number) => {
    const _s = startScroll.current + (-dy) / itemHeight    
    if (_s < 0) {
      return _s * 0.3
    } else if (_s > props.options.length - 1) {
      return props.options.length - 1 + (_s - (props.options.length - 1)) * 0.3
    }

    return _s
  }, [])
  
  const [inertiaFrame, inertiaAnimator] = useInertiaAnimator()
  const status = useDraggable(picker, {
    onDragStart: (status) => {
      inertiaAnimator.stop()
    },

    onDragEnd: (status) => {
      startScroll.current = calcScroll(status.dy)

      inertiaAnimator.start({
        from: startScroll.current,
        velocity: -(status.vy),
        power: 10,
        timeConstant: 300,
        modifiedTarget(ideal: number) {
          return Math.round(ideal)
        },
        min: 0,
        max: props.options.length - 1,
        stiffness: 100,
        damping: 20
      })
  }})

  let scroll: number
  if (inertiaAnimator.status === "inactive") {
    scroll = calcScroll(status.dy)
  } else {
    scroll = inertiaFrame.values[0]
    startScroll.current = scroll
  }

  useEffect(() => {
    const pos = Math.min(Math.max(Math.round(scroll), 0), props.options.length - 1)
    const newValue = props.options[pos]

    if (prevValue.current !== newValue) {
      props.onChange?.(newValue)
      prevValue.current = newValue
    }
  })
  
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
