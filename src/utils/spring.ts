import { FrameGenerator } from "./animation"
import { calcGeneratorVelocity } from "./calcGeneratorVelocity"

interface SpringOptions {
  from: number
  to: number
  stiffness: number
  damping: number
  mass: number
  velocity: number
}


const millisecondsToSeconds = (milliseconds: number) =>
    milliseconds / 1000

const secondsToMilliseconds = (seconds: number) => seconds * 1000


function calcAngularFreq(undampedFreq: number, dampingRatio: number) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio)
}



// refers to https://github.com/Popmotion/popmotion
export function spring(options: SpringOptions): FrameGenerator {
  const origin = options.from
  const target = options.to

  const state = { done: false, value: origin }

  const { stiffness, damping, mass, velocity } = options

  const initialVelocity = velocity ? -millisecondsToSeconds(velocity) : 0.0
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))
  const initialDelta = target - origin
  const undampedAngularFreq = millisecondsToSeconds(
    Math.sqrt(stiffness / mass)
  )

  /**
  * If we're working on a granular scale, use smaller defaults for determining
  * when the spring is finished.
  *
  * These defaults have been selected emprically based on what strikes a good
  * ratio between feeling good and finishing as soon as changes are imperceptible.
  */
  const isGranularScale = Math.abs(initialDelta) < 5
  let restSpeed = isGranularScale ? 0.01 : 2
  let restDelta = isGranularScale ? 0.005 : 0.5

  let resolveSpring: (t: number) => number


  if (dampingRatio < 1) {
    // Underdamped spring
    const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio)

    resolveSpring = (t: number) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t)

      return (
          target -
          envelope *
              (((initialVelocity +
                  dampingRatio * undampedAngularFreq * initialDelta) /
                  angularFreq) *
                  Math.sin(angularFreq * t) +
                  initialDelta * Math.cos(angularFreq * t))
      )
    }

  } else if (dampingRatio === 1) {

    // Critically damped spring
    resolveSpring = (t: number) =>
            target -
            Math.exp(-undampedAngularFreq * t) *
                (initialDelta +
                    (initialVelocity + undampedAngularFreq * initialDelta) * t)

  } else {
    // Overdamped spring
    const dampedAngularFreq =
    undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1)

    resolveSpring = (t: number) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t)

      // When performing sinh or cosh values can hit Infinity so we cap them here
      const freqForT = Math.min(dampedAngularFreq * t, 300)

      return (
          target -
          (envelope *
              ((initialVelocity +
                  dampingRatio * undampedAngularFreq * initialDelta) *
                  Math.sinh(freqForT) +
                  dampedAngularFreq *
                      initialDelta *
                      Math.cosh(freqForT))) /
              dampedAngularFreq
      )
  }
  }

  return {
    next(t: number) {
      const current = resolveSpring(t)
      let currentVelocity = initialVelocity

      if (t !== 0) {
          /**
           * We only need to calculate velocity for under-damped springs
           * as over- and critically-damped springs can't overshoot, so
           * checking only for displacement is enough.
           */
          if (dampingRatio < 1) {
              currentVelocity = calcGeneratorVelocity(
                  resolveSpring,
                  t,
                  current
              )
          } else {
              currentVelocity = 0
          }
      }

      const isBelowVelocityThreshold =
          Math.abs(currentVelocity) <= restSpeed!
      const isBelowDisplacementThreshold =
          Math.abs(target - current) <= restDelta!

      state.done =
          isBelowVelocityThreshold && isBelowDisplacementThreshold

      state.value = state.done ? target : current
      return state

    }
  }
}
