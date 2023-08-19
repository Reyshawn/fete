import { useFloating, UseFloatingOptions } from "@floating-ui/react-dom";
import { useCallback, useRef, useState } from "react";
import useClickAway from "./useClickAway";


interface UseDisclosureProps extends UseFloatingOptions {
  default?: boolean,
}

export default function useDisclosure(props: UseDisclosureProps) {
  const { 
    default: defaultValue = false,
  } = props

  const {refs, floatingStyles } = useFloating(props)

  const willTriggerAnchor = useRef(false)
  const [isPopperShown, setIsPopperShown] = useState(defaultValue)
  
  useClickAway(refs.floating, (event) => {
    if (!isPopperShown) {
      return
    }

    if (event.target === refs.reference.current) {
      willTriggerAnchor.current = true
    } else {
      willTriggerAnchor.current = false
    }
    
    setIsPopperShown(false)   
  })
  
  const open = useCallback(() => {
    if (willTriggerAnchor.current) {
      willTriggerAnchor.current = false
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
    })
  }
}
