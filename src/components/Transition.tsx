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
  const isMounted = useRef(false)

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
    // which will not enter the transition
    if (stage !== TransitionStage.notMounted && stage !== TransitionStage.leaveTransitionStart) {
      setStage(TransitionStage.mounted)
      return
    }

    setStage(TransitionStage.beforeEnterTransition)
  }, [stage])


  const beginLeaveTransition = useCallback(() => {
    // which could not enter the transition
    if (stage !== TransitionStage.mounted && stage !== TransitionStage.enterTransitionStart) {
      setStage(TransitionStage.notMounted)
      return
    }

    setStage(TransitionStage.beforeLeaveTransition)
  }, [stage])


  useEffect(() => {
    if (!isMounted.current) {
      return
    }

    if (props.if) {
      beginEnterTransition()
    } else {
      beginLeaveTransition()
    }
  }, [props.if])


  useLayoutEffect(() => {
    switch (stage) {
      case TransitionStage.beforeEnterTransition:
        resetNode(nodeRef.current!, props.name) 
        nodeRef.current?.removeEventListener("transitionend", handleEnterTransitionEnd)
        nodeRef.current?.removeEventListener("transitionend", handleLeaveTransitionEnd)
        nodeRef.current?.classList.add(`${props.name}-enter-from`)
        
        nextFrame(() => {
          setStage(TransitionStage.enterTransitionStart)
          nodeRef.current?.addEventListener("transitionend", handleEnterTransitionEnd)
        })

        break
      case TransitionStage.enterTransitionStart:
        nodeRef.current?.classList.add(`${props.name}-enter-active`)
        nodeRef.current?.classList.remove(`${props.name}-enter-from`)
        break
      case TransitionStage.beforeLeaveTransition: 
        resetNode(nodeRef.current!, props.name)
        nodeRef.current?.removeEventListener("transitionend", handleEnterTransitionEnd)
        nodeRef.current?.removeEventListener("transitionend", handleLeaveTransitionEnd)
        nodeRef.current?.classList.add(`${props.name}-leave-active`)

        nextFrame(() => {
          setStage(TransitionStage.leaveTransitionStart)
          nodeRef.current?.addEventListener("transitionend", handleLeaveTransitionEnd)
        })

        break
      case TransitionStage.leaveTransitionStart:
        nodeRef.current?.classList.add(`${props.name}-leave-to`)
        break
      default:
        if (nodeRef.current) {
          resetNode(nodeRef.current, props.name)
          nodeRef.current?.removeEventListener("transitionend", handleEnterTransitionEnd)
          nodeRef.current?.removeEventListener("transitionend", handleLeaveTransitionEnd)
        }
        
        break
    }
  }, [stage])

  useEffect(() => {
    isMounted.current = true
  }, [])

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
