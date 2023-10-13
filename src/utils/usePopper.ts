import { PopperProps } from "@/components/Popper";
import { useFloating, UseFloatingOptions } from "@floating-ui/react-dom";
import { MouseEventHandler, Ref, useCallback, useRef, useState } from "react";
import useClickAway from "./useClickAway";


interface UsePopperProps extends UseFloatingOptions {
  default?: boolean,
}


interface AnchorProps<T = HTMLElement> {
  ref: Ref<T>,
  onClick: MouseEventHandler
}

export default function usePopper(props: UsePopperProps): {
  getAnchorProps: () => AnchorProps,
  getPopperProps: () => Omit<PopperProps, "children">
} {
  const {
    default: defaultValue = false,
  } = props

  const { refs, floatingStyles } = useFloating(props)
  
  const anchorRef = useRef<HTMLElement | null>(null)
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
      ref: (node) => {
        if (anchorRef.current == null) {
          anchorRef.current = node
        }

        refs.setReference(node)
      },
      onClick: open
    }),

    getPopperProps: () => ({
      active: isPopperShown,
      setFloating: refs.setFloating,
      floatingStyles: floatingStyles
    })
  }
}
