import { useCallback, useMemo, useRef, useState } from "react";
import { AnimationFrame, AnimationState, Animator, AnimatorConfiguration, createAnimator, FrameGenerator } from "./animation";
import { inertia } from "./inertia";


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
  const [rendering, setRendering] = useState(0)
  
  const frame = useRef<AnimationFrame>({
    elapsedTime: 0,
    values: []
  })

  const animationState = useRef<AnimationState<InertiaAnimatorConfiguration>>({
    status: "inactive",
    startTime: 0,
    pausedTime: 0,
    rafId: null
  })

  const generator = useRef<FrameGenerator>()


  const tick = useCallback((now: DOMHighResTimeStamp) => {

    if (generator.current == null ) {
      generator.current = inertia(animationState.current.config!)
    }

    const {startTime, pausedTime} = animationState.current
    const elapsed = Math.max(0, pausedTime + now - startTime)
    const state = generator.current!.next(elapsed)

    if (!state.done) {
      animationState.current.rafId = requestAnimationFrame(tick)
    }

    frame.current.elapsedTime = elapsed
    frame.current.values[0] = state.value
    animationState.current.status = state.done ? "finished" : "running"
    setRendering(i => i + 1)
  }, [])

  const animator = createAnimator<InertiaAnimatorConfiguration>(setRendering, frame.current, animationState.current, tick)


  return [frame.current, animator]
}
