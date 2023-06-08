const velocitySampleDuration = 5 // ms

export function velocityPerSecond(velocity: number, frameDuration: number) {
  return frameDuration ? velocity * (1000 / frameDuration) : 0
}

export function calcGeneratorVelocity(
  resolveValue: (v: number) => number,
  t: number,
  current: number
) {
  const prevT = Math.max(t - velocitySampleDuration, 0)
  return velocityPerSecond(current - resolveValue(prevT), t - prevT)
}
