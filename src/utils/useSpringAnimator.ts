import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { getCurve, AnimatorConfiguration, AnimationKeyframe, AnimationStatus, Animator, createAnimator } from "./animation"
import { spring } from "./spring"


interface SpringAnimationKeyframe {
  status: "pasued" | "inactive" | "running" | "finished"
  currentValue: number[]
  elapsedTime: number
  current: () => number[]
}


interface SpringAnimatorConfiguration {
  from: number[]
  to: number[]
  stiffness: number
  damping: number
  mass: number
  velocity: number
}




interface SpringAnimator {
  start: () => void,
  pause: () => void,
  // set: (progress: number) => void,
  continue: () => void
}

interface SpringAnimationStatus {
  startTime: number
  pausedTime: number
  rafId: number | null
}








function createSpringAnimator(
  setRendering: React.Dispatch<React.SetStateAction<number>>,
  keyframe: SpringAnimationKeyframe,
  status: SpringAnimationStatus,
  tick: (now: number) => void
  ): SpringAnimator {
  
  const animator = useMemo<SpringAnimator>(() => ({
    start() {
      if (status.rafId) {
        cancelAnimationFrame(status.rafId)
        status.rafId = null
      }

      keyframe.status = "running"
      status.startTime = performance.now()
      status.pausedTime = 0
      tick(status.startTime)
    },

    pause() {
      if (status.rafId) {
        cancelAnimationFrame(status.rafId)
        status.rafId = null
        status.pausedTime = keyframe.elapsedTime
        keyframe.status = "pasued"
        setRendering(i => i+1)
      }
    },

    continue() {
      keyframe.status = "running"
      status.startTime = performance.now()

      tick(status.startTime)
    }
  }), [])

  return animator
}


export function useSpringAnimator(config: SpringAnimatorConfiguration): [SpringAnimationKeyframe, SpringAnimator] {
  const [rendering, setRendering] = useState(0)

  const keyframe = useRef<SpringAnimationKeyframe>({
    status: "inactive",
    elapsedTime: 0,
    current() {
      return this.currentValue
    },
    currentValue: config.from
  })

  const status = useRef<SpringAnimationStatus>({
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

    states.forEach((s, index) => keyframe.current.currentValue[index] = s.value)
    const isDone = states.every(s => s.done)

    if (!isDone) {
      status.current.rafId = requestAnimationFrame(tick)
    }

    keyframe.current.elapsedTime = elapsed
    keyframe.current.status = isDone ? "finished" : "running"
    setRendering(i => i+1)
  }, [])

  const animator = createSpringAnimator(setRendering, keyframe.current, status.current, tick)

  return [keyframe.current, animator]
}
