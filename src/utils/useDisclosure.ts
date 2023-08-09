import { useFloating, UseFloatingOptions } from "@floating-ui/react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import useClickAway from "./useClickAway";


interface UseDisclosureProps extends UseFloatingOptions {

}

export default function useDisclosure(props: UseDisclosureProps) {
  const {refs, floatingStyles } = useFloating(props)

  const hasFiredClickAway = useRef(false)
  const [isPopperShown, setIsPopperShown] = useState(false)

  useClickAway(refs.floating, (event) => {
    if (event.target === refs.reference.current) {
      hasFiredClickAway.current = true
    } else {
      hasFiredClickAway.current = false
    }
    
    setIsPopperShown(false)   
  })

  const open = useCallback(() => {
    console.log("hasFiredClickAway.current", hasFiredClickAway.current)
    if (hasFiredClickAway.current) {
      hasFiredClickAway.current = false
      return
    }
    
    setIsPopperShown(true)
  }, [])

  return {
    getAnchorProps: () => ({
      ref: refs.setReference,
      onClick: open
    }),

    getPopperProps: () => ({
      active: isPopperShown,
      setFloating: refs.setFloating,
      floatingStyles: floatingStyles
    }),

    onOpen: open
  }
}
