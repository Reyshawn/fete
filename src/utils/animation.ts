
import { cubicBezier } from "./cubicBezier"
import { useMemo } from "react"

export enum AnimationTimingCurve {
  linear,
  easeIn,
  easeOut,
  easeInOut
}


export const getCurve = (type: AnimationTimingCurve) => {
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


export interface AnimatorConfiguration {
  duration: number
  easing: AnimationTimingCurve
  from: number[]
  to: number[]
}

export interface AnimationKeyframe {
  status: "pasued" | "inactive" | "running" | "finished"
  progress: number,
  current: () => number[]
}

export interface AnimationStatus {
  startTime: number
  pausedProgress: number
  rafId: number | null
}


export interface Animator {
  start: () => void,
  pause: () => void,
  set: (progress: number) => void,
  continue: () => void
}



export function createAnimator(
  setRendering: React.Dispatch<React.SetStateAction<number>>,
  keyframe: AnimationKeyframe,
  status: AnimationStatus,
  tick: (now: number) => void
  ): Animator {
  

  const animator = useMemo<Animator>(() => ({

    start() { 
      if (status.rafId) {
        cancelAnimationFrame(status.rafId)
        status.rafId = null
      }

      keyframe.status = "running"
      keyframe.progress = 0
      status.pausedProgress = 0

      status.startTime = performance.now()
      tick(status.startTime)
    },

    pause() {
      if (status.rafId) {
        cancelAnimationFrame(status.rafId)
        status.rafId = null
        status.pausedProgress = keyframe.progress
        keyframe.status = "pasued"
        setRendering(i => i+1)
      }
    },

    set(progress: number) {
      if (keyframe.status === "running") {
        return
      }

      keyframe.status === "inactive"
      keyframe.progress = progress
      status.pausedProgress = progress
      setRendering(i => i+1)
    },

    continue() {
      keyframe.status = "running"
      status.startTime = performance.now()
      
      tick(status.startTime)
    }

  }), [])


  return animator
}
