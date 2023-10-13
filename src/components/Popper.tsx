import Transition from "@/components/Transition"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"


export interface PopperProps {
  active: boolean
  children: JSX.Element | JSX.Element[]
  setFloating: (node: HTMLElement | null) => void
  floatingStyles: React.CSSProperties

  container?: Element | DocumentFragment
}


export default function Popper(props: PopperProps) {
  const {
    active,
    children,
    setFloating,
    floatingStyles,
    container
  } = props
  const [isPopperShown, setIsPopperShown] = useState(props.active)

  useEffect(() => {
    if (active) {
      setIsPopperShown(true)
    }
  }, [active])

  const fiberNode = useMemo(() => (
    <div ref={setFloating} style={floatingStyles}>
      <Transition name="popper" if={active} onAfterLeave={() => setIsPopperShown(false)}>
        <div>{children}</div>
      </Transition>
    </div>
  ), [setFloating, floatingStyles, active, children])

  return (
    isPopperShown
      ? (container == null ? fiberNode : createPortal(fiberNode, container))
      : null
  )
}
