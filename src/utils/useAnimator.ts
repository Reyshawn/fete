import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  getCurve,
  AnimatorConfiguration,
  AnimationKeyframe,
  AnimationStatus,
  Animator,
  createAnimator
 } from "./animation"



export function useAnimator(config: AnimatorConfiguration): [AnimationKeyframe, Animator] {
  const { duration, easing } = config
  const [rendering, setRendering] = useState(0)
  const keyframe = useRef<AnimationKeyframe>({
    status: "inactive",
    progress: 0,
    current() {
      const curve = getCurve(easing)
      const p = curve(this.progress)

      return config.from.map((fromValue, index) => fromValue + (config.to[index]  - fromValue) * p)
    }
  })

  const status = useRef<AnimationStatus>({
    startTime: 0,
    pausedProgress: 0,
    rafId: null
  })
  

  const tick = useCallback((now: DOMHighResTimeStamp) => {
    const kf = keyframe.current
    const {startTime, pausedProgress} = status.current
    if (kf.progress >= 1) {
      kf.status = "finished"
      kf.progress = 1
      setRendering(i => i+1)
      return
    }

    const elapsed = now - startTime

    kf.progress =  pausedProgress + elapsed / duration
    setRendering(i => i+1)
    status.current.rafId = requestAnimationFrame(tick)
  }, [])
  

  const animator = createAnimator(setRendering, keyframe.current, status.current, tick)
  return [keyframe.current, animator]
}
