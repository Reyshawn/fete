import { useCallback, useMemo, useRef, useState } from "react"
import {
  getCurve,
  AnimatorConfiguration,
  AnimationFrame,
  AnimationStatus,
  createAnimator,
  InteractiveAnimator,
  convertAnimator
 } from "./animation"


export function useAnimator(config: AnimatorConfiguration): [AnimationFrame, InteractiveAnimator] {
  const { duration, easing } = config
  const [rendering, setRendering] = useState(0)
  const frame = useRef<AnimationFrame>({
    elapsedTime: 0,
    velocity: new Array(config.from.length).fill(0),
    values: [...config.from]
  })

  const status = useRef<AnimationStatus>({
    startTime: 0,
    pausedTime: 0,
    rafId: null
  })

  const tick = useCallback((now: DOMHighResTimeStamp) => {
    const f = frame.current
    const {startTime, pausedTime: pasuedTime} = status.current
    
    const elapsed = Math.max(0, pasuedTime + now - startTime)

    if (elapsed >= duration) {
      ia.status = "finished"
      f.values = [...config.to]
      f.elapsedTime = duration
      setRendering(i => i+1)
      return
    }

    const progress = elapsed / duration

    const curve = getCurve(easing)

    f.elapsedTime = elapsed
    f.values = config.from.map((f, index) => f + (config.to[index] - f) * curve(progress))
    // f.velocity =

    setRendering(i => i+1)
    status.current.rafId = requestAnimationFrame(tick)
  }, [])

  const a = createAnimator(setRendering, frame.current, status.current, tick)
  const ia = useMemo(() => {
    const set = (progress: number) => {
      if (ia.status === "running") {
        return
      }

      ia.status === "inactive"
      const elasped = progress * duration
      
      const curve = getCurve(easing)
      frame.current.elapsedTime = elasped
      frame.current.values = config.from.map((f, index) => f + (config.to[index] - f) * curve(progress))


      setRendering(i => i+1)
    }

    return convertAnimator(a, set)
  }, [])

  return [frame.current, ia]
}
