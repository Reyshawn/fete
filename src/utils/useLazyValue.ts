
import { useRef } from "react";


export default function useLazyValue<T>(factory: () => T): React.MutableRefObject<T> {
  const valueRef = useRef<T>()
  
  const proxy = new Proxy(valueRef, {
    get(target, prop, receiver) {
      if ( prop === "current" && target[(prop as keyof typeof target)] == null) {
        target[(prop as keyof typeof target)] = factory()
      }

      return Reflect.get(target, prop, receiver)
    },
  })

  return proxy as React.MutableRefObject<T>
}