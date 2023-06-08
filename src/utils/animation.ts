
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


export interface AnimationFrame {
  elapsedTime: number
  velocity: number[]
  values: number[]
}


export interface AnimationStatus {
  startTime: number
  pausedTime: number
  rafId: number | null
}


export interface Animator {
  status: "pasued" | "inactive" | "running" | "finished"
  start: () => void,
  pause: () => void,
  continue: () => void
}


export interface InteractiveAnimator extends Animator {
  set: (progress: number) => void
}


export function createAnimator(
  setRendering: React.Dispatch<React.SetStateAction<number>>,
  frame: AnimationFrame,
  status: AnimationStatus,
  tick: (now: number) => void
  ): Animator {
  

  const animator = useMemo<Animator>(() => ({
    status: "inactive",

    start() {
      if (status.rafId) {
        cancelAnimationFrame(status.rafId)
        status.rafId = null
      }
    
      this.status = "running"
      frame.elapsedTime = 0
      status.pausedTime = 0
    
      status.startTime = performance.now()

      tick(status.startTime)
    },

    pause() {
      if (status.rafId) {
        cancelAnimationFrame(status.rafId)
        status.rafId = null
        status.pausedTime = frame.elapsedTime
        this.status = "pasued"
        setRendering(i => i+1)
      }
    },

    continue() {
      this.status = "running"
      status.startTime = performance.now()

      tick(status.startTime)
    }

  }), [])

  return animator
}


export function convertAnimator(animator: Animator, set: (progress: number) => void): InteractiveAnimator {
  const ia = animator as InteractiveAnimator
  ia.set = set

  return ia
}
