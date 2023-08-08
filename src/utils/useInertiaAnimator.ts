import { useCallback, useMemo, useRef, useState } from "react";
import { AnimationFrame, AnimationState, Animator, AnimatorConfiguration, createAnimator, FrameGenerator } from "./animation";
import { inertia } from "./inertia";
import useRerender from "./useRerender";


export interface InertiaAnimatorConfiguration extends AnimatorConfiguration {
  from: number
  velocity: number
  power: number
  timeConstant: number
  modifiedTarget?: (ideal: number) => number
  min?: number
  max?: number
  stiffness?: number
  damping?: number
  mass?: number
}


export function useInertiaAnimator(): [AnimationFrame, Animator<InertiaAnimatorConfiguration>] {
  const setRendering = useRerender()
  
  const frame = useRef<AnimationFrame>({
    elapsedTime: 0,
    values: []
  })

  const animationState = useRef<AnimationState<InertiaAnimatorConfiguration>>({
    status: "inactive",
    startTime: 0,
    pausedTime: 0,
    rafId: null,
  })

  if (animationState.current.generators == null) {
    animationState.current.generators = inertiaGeneratorsFactor(animationState.current)
  }

  const tick = useCallback((now: DOMHighResTimeStamp) => {
    const generator = animationState.current.generators!()[0]
    const {startTime, pausedTime} = animationState.current
    const elapsed = Math.max(0, pausedTime + now - startTime)
    const state = generator.next(elapsed)

    if (!state.done) {
      animationState.current.rafId = requestAnimationFrame(tick)
    }

    frame.current.elapsedTime = elapsed
    frame.current.values[0] = state.value
    animationState.current.status = state.done ? "finished" : "running"
    setRendering()
  }, [])

  const animator = createAnimator<InertiaAnimatorConfiguration>(setRendering, frame.current, animationState.current, tick)


  return [frame.current, animator]
}


function inertiaGeneratorsFactor(state: AnimationState<InertiaAnimatorConfiguration>) {
  let prevConfig: InertiaAnimatorConfiguration | undefined
  let generators: FrameGenerator[] = []
  return () => {
    if (generators.length === 0 || prevConfig !== state.config) {
      generators = [inertia(state.config!)]
      prevConfig = state.config
    }

    return generators
  }
}
