import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"


export enum AnimationTimingCurve {
  linear,
  easeIn,
  easeOut,
  easeInOut
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


interface Animator {
  start: () => void,
  pause: () => void,
  set: (progress: number) => void,
  continue: () => void
}


let startTime = 0
let pausedProgress = 0
let rafId: number | null = null


export function useAnimator<T extends HTMLElement>(config: AnimatorConfiguration): [AnimationKeyframe, Animator] {
  const { duration } = config
  const [rendering, setRendering] = useState(0)
  const keyframe = useRef<AnimationKeyframe>({
    status: "inactive",
    progress: 0,
    current() {
      const p = this.progress

      return config.from.map((fromValue, index) => fromValue + (config.to[index]  - fromValue) * p)
    }
  })

  
  const tick = useCallback((now: DOMHighResTimeStamp) => {
    const kf = keyframe.current
    if (kf.progress >= 1) {
      kf.status = "finished"
      kf.progress = 1
      setRendering(i => i+1)
      return
    }

    const elapsed = now - startTime

    kf.progress =  pausedProgress + elapsed / duration
    setRendering(i => i+1)
    rafId = requestAnimationFrame(tick)
  }, [])

  const animator = useMemo<Animator>(() => ({

    start() { 
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }


      const kf = keyframe.current
      kf.status = "running"
      kf.progress = 0
      pausedProgress = 0

      startTime = performance.now()
      tick(startTime)
    },

    pause() {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
        pausedProgress = keyframe.current.progress
        keyframe.current.status = "pasued"
        setRendering(i => i+1)
      }
    },

    set(progress: number) {
      if (keyframe.current.status === "running") {
        return
      }

      keyframe.current.status === "inactive"
      keyframe.current.progress = progress
      setRendering(i => i+1)
    },

    continue() {
      const kf = keyframe.current
      kf.status = "running"
      startTime = performance.now()
      
      tick(startTime)
    }

  }), [])


  return [keyframe.current, animator]
}





export function useSpringAnimator() {

}