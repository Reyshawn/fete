import { useCallback, useMemo, useRef, useState } from "react";
import { AnimationFrame, AnimationStatus, Animator, createAnimator } from "./animation";
import { inertia } from "./inertia";


export interface InertiaAnimatorConfiguration {
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


export function useInertiaAnimator(config: InertiaAnimatorConfiguration): [AnimationFrame, Animator] {
  const [rendering, setRendering] = useState(0)
  
  const frame = useRef<AnimationFrame>({
    elapsedTime: 0,
    values: [config.from]
  })

  const status = useRef<AnimationStatus>({
    startTime: 0,
    pausedTime: 0,
    rafId: null
  })

  const generator = useMemo(() => inertia(config), [])


  const tick = useCallback((now: DOMHighResTimeStamp) => {
    const {startTime, pausedTime} = status.current
    const elapsed = Math.max(0, pausedTime + now - startTime)
    const state = generator.next(elapsed)

    if (!state.done) {
      status.current.rafId = requestAnimationFrame(tick)
    }

    frame.current.elapsedTime = elapsed
    frame.current.values[0] = state.value
    animator.status = state.done ? "finished" : "running"
    setRendering(i => i + 1)
  }, [])

  const animator = createAnimator(setRendering, frame.current, status.current, tick)


  return [frame.current, animator]
}
