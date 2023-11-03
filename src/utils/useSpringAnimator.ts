import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { AnimationFrame, AnimationState, Animator, AnimatorConfiguration, createAnimator } from "./animation"
import { spring } from "./spring"
import { useLazyValue } from "@fete/hooks"
import { useRerender } from "@fete/hooks"


interface SpringAnimatorConfiguration extends AnimatorConfiguration {
  from: number[]
  to: number[]
  stiffness: number
  damping: number
  mass: number
  velocity: number
}


export function useSpringAnimator(): [AnimationFrame, Animator<SpringAnimatorConfiguration>] {
  const setRendering = useRerender()

  const keyframe = useRef<AnimationFrame>({
    elapsedTime: 0,
    values: []
  })

  const animationState = useRef<AnimationState<SpringAnimatorConfiguration>>({
    status: "inactive",
    startTime: 0,
    pausedTime: 0,
    rafId: null
  })

  const springGenerators = useLazyValue(() => {
    const config = animationState.current.config!
    return config.from.map((f, index) => spring({
      from: f,
      to: config.to[index],
      stiffness: config.stiffness,
      damping: config.damping,
      mass: config.mass,
      velocity: config.velocity
    }))
  })

  const tick = useCallback((now: DOMHighResTimeStamp) => {

    const elapsed = animationState.current.pausedTime + now - animationState.current.startTime
    
    const states = springGenerators.current.map(g => g.next(elapsed))

    states.forEach((s, index) => keyframe.current.values[index] = s.value)
    const isDone = states.every(s => s.done)

    if (!isDone) {
      animationState.current.rafId = requestAnimationFrame(tick)
    }

    keyframe.current.elapsedTime = elapsed
    animationState.current.status = isDone ? "finished" : "running"
    setRendering()
  }, [])

  const animator = createAnimator(setRendering, keyframe.current, animationState.current, tick)

  return [keyframe.current, animator]
}
