import React, { useMemo, useRef, useState, useCallback, useEffect } from "react"
import style from "./style.module.css"

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

  const [scroll, setScroll] = useState(0)
  
  const picker = useRef<HTMLDivElement>(null)

  const isDragging = useRef(false)
  const draggingStatus = useRef({y: 0})
  const scrollLocations = useRef<[number, number][]>([])
  const startScroll = useRef(0)
  const rafId = useRef<number | null>(null)
  const isAnimationInProgress = useRef(false)

  const scrollStopTimer = useRef<NodeJS.Timeout | null>(null)

  const cssVars: React.CSSProperties = {
    ['--item-height' as any]: itemHeight + 'px',
    'height': `${2 * radius}px`
  }

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault()
    if (!isDragging.current) {
      isDragging.current = true

      draggingStatus.current.y = 0
      startScroll.current = scroll
    }

    if (scrollStopTimer.current != null) {
      clearTimeout(scrollStopTimer.current)
      scrollStopTimer.current = null
    }

    draggingStatus.current.y += event.deltaY

    const deltaY = draggingStatus.current.y

    const s = startScroll.current + (deltaY / itemHeight)

    setScroll(s)

    scrollLocations.current.push([s, performance.now()])

    if (scrollLocations.current.length > 4) {
      scrollLocations.current.splice(0, 2)
    }

    scrollStopTimer.current = setTimeout(() => {
      isDragging.current = false
      handleScrollStop()
    }, 500)
  }

  useEffect(() => {
    picker.current?.addEventListener("wheel", handleScroll, {passive: false})
    return () => {
      picker.current?.removeEventListener("wheel", handleScroll)
    }
  }, [])


  const onPickerMousedown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()

    if (isAnimationInProgress.current) {
      cancelAnimationFrame(rafId.current!)
      rafId.current = null
      isAnimationInProgress.current = false
    }

    isDragging.current = true

    draggingStatus.current.y = event.clientY
    startScroll.current = scroll
    picker.current?.addEventListener("mousemove", onPickerMouseMove)
  }

  const onPickerMouseUp: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()

    isDragging.current = false
    picker.current?.removeEventListener("mousemove", onPickerMouseMove)

    handleScrollStop()
  }

  const onPickerMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (isDragging.current) {
      onPickerMouseUp(event)
    }
  }

  const onPickerMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging.current) {
      return
    }

    const y = event.clientY
    const deltaY = - y + draggingStatus.current.y

    const s = startScroll.current + (deltaY / itemHeight)
    setScroll(s)

    scrollLocations.current.push([s, performance.now()])

    if (scrollLocations.current.length > 4) {
      scrollLocations.current.splice(0, 2)
    }
  }, [])


  const handleScrollStop = () => {
    const length = scrollLocations.current.length
    const firstLoc  = scrollLocations.current[length - 2]
    const secondLoc = scrollLocations.current[length - 1]

    const speed = (secondLoc[0] - firstLoc[0]) * 1000 / (secondLoc[1] - firstLoc[1])
    animateBy(speed)
  }


  const animateBy = (speed: number) => {
    let initScroll = scroll
    let finaleScroll

    let a = speed > 0 ? -acceleration : acceleration
      
    let t = Math.abs( speed / a )

    let d = speed * t + a * t * t / 2

    finaleScroll = Math.min(Math.max(0, Math.round(initScroll + d)), props.options.length - 1)

    isAnimationInProgress.current = true
    animate.fromTo({
      from: initScroll,
      to: finaleScroll,
      duration: t * 1000,
      easing: x => (1 - Math.pow(1 - x, 2))
    }, (val, id, done) => {
        setScroll(val)
        rafId.current = id
        if (done) {
          isAnimationInProgress.current = false
        }
    })
  }

  return (
    <div
      className={style["d-picker"]}
      style={cssVars}
      ref={picker}
      onMouseDown={onPickerMousedown}
      onMouseUp={onPickerMouseUp}
      onMouseLeave={onPickerMouseLeave}>
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
