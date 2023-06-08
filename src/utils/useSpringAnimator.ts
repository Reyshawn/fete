import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { AnimationFrame, AnimationStatus, Animator, createAnimator } from "./animation"
import { spring } from "./spring"


interface SpringAnimatorConfiguration {
  from: number[]
  to: number[]
  stiffness: number
  damping: number
  mass: number
  velocity: number
}


export function useSpringAnimator(config: SpringAnimatorConfiguration): [AnimationFrame, Animator] {
  const [rendering, setRendering] = useState(0)

  const keyframe = useRef<AnimationFrame>({
    elapsedTime: 0,
    values: [...config.from]
  })

  const status = useRef<AnimationStatus>({
    startTime: 0,
    pausedTime: 0,
    rafId: null
  })

  const springGenerators = useMemo(() => config.from.map((f, index) => {
    return spring({
      from: f,
      to: config.to[index],
      stiffness: config.stiffness,
      damping: config.damping,
      mass: config.mass,
      velocity: config.velocity
    })
  }), [])

  const tick = useCallback((now: DOMHighResTimeStamp) => {

    const elapsed = status.current.pausedTime + now - status.current.startTime
    
    const states = springGenerators.map(g => g.next(elapsed))

    states.forEach((s, index) => keyframe.current.values[index] = s.value)
    const isDone = states.every(s => s.done)

    if (!isDone) {
      status.current.rafId = requestAnimationFrame(tick)
    }

    keyframe.current.elapsedTime = elapsed
    animator.status = isDone ? "finished" : "running"
    setRendering(i => i+1)
  }, [])

  const animator = createAnimator(setRendering, keyframe.current, status.current, tick)

  return [keyframe.current, animator]
}
