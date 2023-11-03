import { PopperProps } from "@/components/Popper";
import {
  autoUpdate,
  useFloating,
  UseFloatingOptions,
  offset,
  flip,
  shift
} from "@floating-ui/react-dom";
import { MouseEventHandler, Ref, useCallback, useRef, useState } from "react";
import { mergeRefs } from "./mergeRefs";
import { useClickAway } from "@fete/hooks";


interface UsePopperProps extends UseFloatingOptions {
  default?: boolean,
}


interface AnchorProps<T> {
  ref: Ref<T>,
  onClick: MouseEventHandler<T>
}

export default function usePopper<T extends HTMLElement>(props: UsePopperProps | undefined = {}): {
  getAnchorProps: () => AnchorProps<T>,
  getPopperProps: () => Omit<PopperProps, "children">
} {
  const {
    default: defaultValue = false,
  } = props

  const anchorRef = useRef<HTMLElement | null>(null)
  const { refs, floatingStyles, placement } = useFloating({
    placement: "bottom-start",
    middleware: [offset(10), shift(), flip()],
    whileElementsMounted: autoUpdate,
    ...props
  })
  
  const [isPopperShown, setIsPopperShown] = useState(defaultValue)

  useClickAway({
    enabled: isPopperShown,
    ref: refs.floating, 
    handler: (event) => {
      if (!anchorRef.current?.contains(event.target as HTMLElement)) {
        setIsPopperShown(false)
      }
    }
  })

  const open = useCallback<MouseEventHandler>((event) => {
    setIsPopperShown(i => !i)
  }, [])

  return {
    getAnchorProps: () => ({
      ref: mergeRefs(refs.setReference, anchorRef),
      onClick: open
    }),

    getPopperProps: () => ({
      active: isPopperShown,
      setFloating: refs.setFloating,
      floatingStyles: floatingStyles,
      placement
    })
  }
}
