import { FrameGenerator } from "./animation"
import { InertiaAnimatorConfiguration } from "./useInertiaAnimator"
import { spring } from "./spring"
import { calcGeneratorVelocity } from "./calcGeneratorVelocity"


export function inertia(options: InertiaAnimatorConfiguration): FrameGenerator {

  const { 
    from,
    velocity,
    power,
    min,
    max,
    modifiedTarget,
    timeConstant,
    stiffness,
    damping,
    mass  
  } = options
  let amplitude = power * velocity
  const ideal = from + amplitude
  const target = modifiedTarget === undefined ? ideal : modifiedTarget(ideal)
  
  
  const state = {done: false, value: from}


  const isOutOfBounds = (v: number) =>
    (min !== undefined && v < min) || (max !== undefined && v > max)

  const nearestBoundary = (v: number) => {
    if (min === undefined) return max
    if (max === undefined) return min
  
    return Math.abs(min - v) < Math.abs(max - v) ? min : max
  }
  
  if (target !== ideal) amplitude = target - from

  const calcDelta = (t: number) => -amplitude * Math.exp(-t / timeConstant)

  const calcLatest = (t: number) => target + calcDelta(t)

  const applyFriction = (t: number) => {
      const delta = calcDelta(t)
      const latest = calcLatest(t)
      state.done = Math.abs(delta) <= 0.001
      state.value = state.done ? target : latest
  }
  

  let timeReachedBoundary: number | undefined
  let springGenerator: FrameGenerator | undefined

  const checkCatchBoundary = (t: number) => {
    if (!isOutOfBounds(state.value)) return

    timeReachedBoundary = t
    springGenerator = spring({
      from: state.value,
      to: nearestBoundary(state.value)!,
      stiffness: stiffness ?? 100,
      damping: damping ?? 5,
      mass: mass ?? 1,
      velocity: calcGeneratorVelocity(calcLatest, t, state.value),
    })
  }

  return {
    next(t: number) {
      let hasUpdatedFrame = false
      if (springGenerator == null && timeReachedBoundary == null) {
        hasUpdatedFrame = true
        applyFriction(t) 
        checkCatchBoundary(t)
      }

      /**
       * If we have a spring and the provided t is beyond the moment the friction
       * animation crossed the min/max boundary, use the spring.
       */
      if (timeReachedBoundary !== undefined && t > timeReachedBoundary) {
        return springGenerator!.next(t - timeReachedBoundary)
      } else {
        
        !hasUpdatedFrame && applyFriction(t)

        return state
      }
    }
  }
}
