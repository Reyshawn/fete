import { RefObject, useEffect, useRef } from 'react';

type EventHandlerType = <K extends keyof DocumentEventMap>(evt: DocumentEventMap[K]) => void

const defaultEvents: (keyof DocumentEventMap)[] = ['mousedown', 'touchstart'];


interface UseClickAwayProps {
  enabled?: boolean,
  ref: RefObject<HTMLElement | null>,
  handler: EventHandlerType,
  events?: (keyof DocumentEventMap)[]
}

const useClickAway = <E extends Event = Event>(props: UseClickAwayProps) => {
  const {
    enabled = true,
    ref,
    handler: onClickAway,
    events = defaultEvents
  } = props
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handler: EventHandlerType = (event) => {
      const { current: el } = ref
      el && !el.contains(event.target as HTMLElement) && savedCallback.current(event);
    }
    for (const eventName of events) {
      document.addEventListener(eventName, handler)
    }
    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handler)
      }
    }
  }, [enabled, events, ref])
}

export default useClickAway
