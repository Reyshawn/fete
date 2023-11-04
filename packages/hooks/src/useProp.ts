import { DependencyList, useCallback, useRef } from "react"
import useRerender from "./useRerender"

export default function useProp<T>(
  prop: T,
  dependency: DependencyList | undefined = undefined
): [T, (newValue: T) => void] {
  const propRef = useRef(prop)
  const setRendering = useRerender()

  const depRef = useRef(dependency)
  const valueRef = useRef(prop)

  if (
    prop !== propRef.current ||
    isDependencyChanged(depRef.current, dependency)
  ) {
    valueRef.current = prop
    propRef.current = prop
    depRef.current = dependency
  }

  const setValue = useCallback((newValue: T) => {
    valueRef.current = newValue
    setRendering()
  }, [])

  return [valueRef.current, setValue]
}

function isDependencyChanged(
  depA: DependencyList | undefined,
  depB: DependencyList | undefined
) {
  if (depA === depB) {
    return false
  }

  if (depA == null || depB == null) {
    return true
  }

  if (depA.length !== depB.length) {
    return true
  }

  let i = 0
  while (i < depA.length) {
    if (depA[i] !== depB[i]) {
      return true
    }
    i++
  }
  return false
}
