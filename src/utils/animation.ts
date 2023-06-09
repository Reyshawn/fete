
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

}


export interface EasingAnimatorConfiguration extends AnimatorConfiguration {
  duration: number
  easing: AnimationTimingCurve
  from: number[]
  to: number[]
}


export interface AnimationFrame {
  elapsedTime: number
  values: number[]
}


export interface AnimationState<T extends  AnimatorConfiguration> {
  status: AnimatorStatus
  config?: T
  startTime: number
  pausedTime: number
  rafId: number | null
}

type AnimatorStatus = "pasued" | "inactive" | "running" | "finished"

export interface Animator<T extends AnimatorConfiguration> {
  readonly status: AnimatorStatus
  start: (conf: T) => void
  pause: () => void
  continue: () => void
  stop: () => void
}


export interface InteractiveAnimator<T> extends Animator<T> {
  set: (progress: number) => void
}


export interface FrameGenerator {
  next(t: number): {done: boolean, value: number}
}


export function createAnimator<T extends AnimatorConfiguration>(
  setRendering: React.Dispatch<React.SetStateAction<number>>,
  frame: AnimationFrame,
  state: AnimationState<T>,
  tick: (now: number) => void
  ): Animator<T> {


  const animator = useMemo<Animator<T>>(() => ({
    get status(): AnimatorStatus {
      return state.status
    },
    start(conf: T) {
      state.config = conf
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
        state.rafId = null
      }
    
      state.status = "running"
      frame.elapsedTime = 0
      state.pausedTime = 0
    
      state.startTime = performance.now()

      tick(state.startTime)
    },

    pause() {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
        state.rafId = null
        state.pausedTime = frame.elapsedTime
        state.status = "pasued"
        setRendering(i => i+1)
      }
    },

    continue() {
      state.status = "running"
      state.startTime = performance.now()

      tick(state.startTime)
    },
    
    stop() {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId)
        state.rafId = null
      }

      state.status = "inactive"

    }

  }), [])

  return animator
}


export function convertAnimator<T>(animator: Animator<T>, set: (progress: number) => void): InteractiveAnimator<T> {
  const ia = animator as InteractiveAnimator<T>
  ia.set = set

  return ia
}
