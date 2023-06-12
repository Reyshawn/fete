import Transition from "@/components/Transition"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface PopperProps {
  active: boolean
  children: JSX.Element
  setFloating: (node: HTMLElement | null) => void
  floatingStyles:  React.CSSProperties
}


export default function Popper(props: PopperProps) {
  const [isPopperShown, setIsPopperShown] = useState(false)


  useEffect(() => {
    if (props.active) {
      setIsPopperShown(true)
    } else {
  
    }
  }, [props.active])
  

  return (
    isPopperShown ? createPortal(
      <div ref={props.setFloating} style={props.floatingStyles}>
        <Transition name="popper" onAfterLeave={() => setIsPopperShown(false)}>
          {props.active ? <div>{props.children}</div> : null}
        </Transition>
      </div>, document.body
    ) : <></>
  )
}
