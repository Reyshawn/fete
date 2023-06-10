import { RefObject, useEffect, useRef } from 'react';


type EventHandlerType = <K extends keyof DocumentEventMap>(evt: DocumentEventMap[K]) => void

const defaultEvents: (keyof DocumentEventMap)[] = ['mousedown', 'touchstart'];

const useClickAway = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: EventHandlerType,
  events: (keyof DocumentEventMap)[] = defaultEvents
) => {
  const savedCallback = useRef(onClickAway);
  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);
  useEffect(() => {
    const handler: EventHandlerType = (event) => {
      const { current: el } = ref
      el && !el.contains(event.target as HTMLElement) && savedCallback.current(event);
    };
    for (const eventName of events) {
      document.addEventListener(eventName, handler)
    }
    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handler)
      }
    };
  }, [events, ref])
};

export default useClickAway
