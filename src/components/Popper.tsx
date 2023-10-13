import Transition from "@/components/Transition"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface PopperProps {
  active: boolean
  children: JSX.Element
  setFloating: (node: HTMLElement | null) => void
  floatingStyles: React.CSSProperties
}


export default function Popper(props: PopperProps) {
  const { active, children, setFloating, floatingStyles } = props
  const [isPopperShown, setIsPopperShown] = useState(props.active)

  useEffect(() => {
    if (active) {
      setIsPopperShown(true)
    }
  }, [active])

  return (
    isPopperShown ? createPortal(
      <div ref={setFloating} style={floatingStyles}>
        <Transition name="popper" if={active} onAfterLeave={() => setIsPopperShown(false)}>
          <div>{children}</div>
        </Transition>
      </div>, document.body
    ) : null
  )
}
