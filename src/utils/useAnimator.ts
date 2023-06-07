import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { noop } from "rxjs"
import { cubicBezier } from "./cubicBezier"

export enum AnimationTimingCurve {
  linear,
  easeIn,
  easeOut,
  easeInOut
}


const getCurve = (type: AnimationTimingCurve) => {
  switch (type) {
    case AnimationTimingCurve.linear:
      return (n: number) => n
    case AnimationTimingCurve.easeIn:
      return cubicBezier(0.42, 0, 1, 1)
    case AnimationTimingCurve.easeOut:
      return cubicBezier(0, 0, 0.58, 1)
    case AnimationTimingCurve.easeInOut:
      return cubicBezier(0, 0, 0.58, 1)
  }
}


interface AnimatorConfiguration {
  duration: number
  easing: AnimationTimingCurve
  from: number[]
  to: number[]
}

interface AnimationKeyframe {
  status: "pasued" | "inactive" | "running" | "finished"
  progress: number,
  current: () => number[]
}

interface AnimationStatus {
  startTime: number
  pausedProgress: number
  rafId: number | null
}


interface Animator {
  start: () => void,
  pause: () => void,
  set: (progress: number) => void,
  continue: () => void
}


// let startTime = 0
// let pausedProgress = 0
// let rafId: number | null = null


export function useAnimator<T extends HTMLElement>(config: AnimatorConfiguration): [AnimationKeyframe, Animator] {
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

  const animator = useMemo<Animator>(() => ({

    start() { 
      const s = status.current
      if (s.rafId) {
        cancelAnimationFrame(s.rafId)
        status.current.rafId = null
      }


      const kf = keyframe.current
      kf.status = "running"
      kf.progress = 0
      s.pausedProgress = 0

      s.startTime = performance.now()
      tick(s.startTime)
    },

    pause() {
      const s = status.current
      if (s.rafId) {
        cancelAnimationFrame(s.rafId)
        s.rafId = null
        s.pausedProgress = keyframe.current.progress
        keyframe.current.status = "pasued"
        setRendering(i => i+1)
      }
    },

    set(progress: number) {
      const s = status.current
      if (keyframe.current.status === "running") {
        return
      }

      keyframe.current.status === "inactive"
      keyframe.current.progress = progress
      s.pausedProgress = progress
      setRendering(i => i+1)
    },

    continue() {
      const s = status.current
      const kf = keyframe.current
      kf.status = "running"
      s.startTime = performance.now()
      
      tick(s.startTime)
    }

  }), [])


  return [keyframe.current, animator]
}





export function useSpringAnimator() {

}