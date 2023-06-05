type AnimateConfig = {
  from: number
  to: number
  easing?: (progress: number) => number
  duration?: number
}

type AnimateCallback = (progress: number, rafId: number | null, done: Boolean) => void


export default function animate(duration:number, fn: AnimateCallback) {
  const start = performance.now();

  let progress = 0; // between 0 and 1, +/-

  function tick(now: DOMHighResTimeStamp) {
    if (progress >= 1) {
      fn(1, null, true);
      return;
    }

    const elapsed = now - start;
    progress = elapsed / duration;
    const rafId = requestAnimationFrame(tick); // every 16.6666667 ms
    // callback
    fn(progress, rafId, false); // number between 0 and 1

  }

  tick(start);
}

function easing(progress: number) {
  return (1 - Math.cos(progress * Math.PI)) / 2
}

const animationDefaults = {
  duration: 1000,
  easing
}

animate.fromTo = (animateConfig: AnimateConfig, fn: AnimateCallback) => {
  const easing = animateConfig.easing || animationDefaults.easing;
  const duration = animateConfig.duration || animationDefaults.duration;
  const {to, from} = animateConfig

  const delta = to - from;

  return animate(duration, (progress, rafId, done) => fn(from + easing(progress) * delta, rafId, done));
}