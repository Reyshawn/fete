import { useRef, cloneElement, useState, useEffect, useCallback, useLayoutEffect, useInsertionEffect } from "react"
import { resetNode } from "./TransitionGroup"

interface TransitionProps {
  if: boolean
  name: string
  children: JSX.Element
  onAfterLeave?: () => void
  onAfterEnter?: () => void
}


enum TransitionStage {
  beforeEnterTransition = 1, // apply enter-from enter-active classname
  enterTransitionStart, // apply enter-to enter-active classname
  beforeLeaveTransition, //  apply leave-from leave-active classname
  leaveTransitionStart, // apply leave-to leave-active classname 
  notMounted,
  mounted
}


export function nextFrame(cb: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}


export default function Transition(props: TransitionProps) {
  const [stage, setStage] = useState<TransitionStage>(TransitionStage.notMounted)
  const nodeRef = useRef<HTMLElement | null>(null)

  // TODO
  // If the transition didn't really start, stage will remain at the `.enterTransitionStart`
  const handleEnterTransitionEnd = useCallback(() => {
    nodeRef.current?.removeEventListener("transitionend", handleEnterTransitionEnd)
    setStage(TransitionStage.mounted)
    props.onAfterEnter?.()
  }, [])


  // TODO
  // If the transition didn't really start, stage will remain at the `.leaveTransitionStart`
  const handleLeaveTransitionEnd = useCallback(() => {
    nodeRef.current?.removeEventListener("transitionend", handleLeaveTransitionEnd)
    setStage(TransitionStage.notMounted)
    props.onAfterLeave?.()
  }, [])

  const beginEnterTransition = useCallback(() => {
    if (stage !== TransitionStage.notMounted && stage !== TransitionStage.leaveTransitionStart) {
      setStage(TransitionStage.mounted)
      return
    }

    setStage(TransitionStage.beforeEnterTransition)
    nextFrame(() => {
      setStage(TransitionStage.enterTransitionStart)
      nodeRef.current?.addEventListener("transitionend", handleEnterTransitionEnd)
    })
  }, [stage])


  const beginLeaveTransition = useCallback(() => {
    if (stage !== TransitionStage.mounted && stage !== TransitionStage.enterTransitionStart) {
      setStage(TransitionStage.notMounted)
      return
    }

    setStage(TransitionStage.beforeLeaveTransition)

    nextFrame(() => {
      setStage(TransitionStage.leaveTransitionStart)
      nodeRef.current?.addEventListener("transitionend", handleLeaveTransitionEnd)
    })
  }, [stage])


  useEffect(() => {
    if (props.if) {
      beginEnterTransition()
    } else {
      beginLeaveTransition()
    }
  }, [props.if])

  useLayoutEffect(() => {
    switch (stage) {
      case TransitionStage.beforeEnterTransition:
        nodeRef.current?.classList.add(`${props.name}-enter-from`)
        break
      case TransitionStage.enterTransitionStart:
        nodeRef.current?.classList.add(`${props.name}-enter-active`)
        nodeRef.current?.classList.remove(`${props.name}-enter-from`)
        break
      case TransitionStage.beforeLeaveTransition: 
        nodeRef.current?.classList.add(`${props.name}-leave-active`)
        break
      case TransitionStage.leaveTransitionStart:
        nodeRef.current?.classList.remove(`${props.name}-leave-from`)
        nodeRef.current?.classList.add(`${props.name}-leave-to`)
        break
      default:
        if (nodeRef.current) {
          resetNode(nodeRef.current, props.name)
        }
        
        break
    }
  }, [stage])

  switch (stage) {
    case TransitionStage.notMounted:
      return null
    case TransitionStage.mounted:
      return props.children

    default:
      return cloneElement(props.children, {
        ref: (el: HTMLElement | null) => {
          if (el) {
            nodeRef.current = el
          }
        }
      })
  }
}
