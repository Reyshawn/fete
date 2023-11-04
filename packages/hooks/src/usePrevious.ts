import { useEffect, useRef } from "react"

// refer to https://github.com/streamich/react-use/blob/master/src/usePrevious.ts
export default function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = state
  })

  return ref.current
}
