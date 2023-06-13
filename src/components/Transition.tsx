import { useRef, cloneElement, useState, useEffect, useCallback, useLayoutEffect } from "react"

interface TransitionProps {
  name: string
  children: JSX.Element | null
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
  const isMounted = useRef(false)
  const prevChildren = useRef(props.children)

  // TODO
  // If the transition didn't really start, stage will remain at the `.enterTransitionStart`
  const handleEnterTransitionEnd = useCallback(() => {
    setStage(TransitionStage.mounted)
    props.onAfterEnter?.()
  }, [])


  // TODO
  // If the transition didn't really start, stage will remain at the `.leaveTransitionStart`
  const handleLeaveTransitionEnd = useCallback(() => {
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
    })
  }, [stage])


  useLayoutEffect(() => {
    if (!isMounted.current) {
      return
    }

    if (props.children !== null) {
      beginEnterTransition()
    } else {
      beginLeaveTransition()
    }
  }, [props.children === null])


  useEffect(() => {
    if (props.children !== null) {
      beginEnterTransition()

    } else {
      // console.log("render nothing")
    }
    isMounted.current = true
  } ,[])

  switch (stage) {
    case TransitionStage.notMounted:
      prevChildren.current = null
      return <></>
    case TransitionStage.mounted:
      return <>{props.children}</>
    case TransitionStage.beforeEnterTransition:
      if (props.children) {
        prevChildren.current = cloneElement(props.children)
      }

      return (
        <>
          {props.children && cloneElement(props.children, {className: `${props.name}-enter-from ${props.name}-enter-active`})}
        </>
      )
    case TransitionStage.enterTransitionStart:
      return (
        <>
          {prevChildren.current && cloneElement(prevChildren.current!, {
            className: `${props.name}-enter-to ${props.name}-enter-active`,
            onTransitionEnd: handleEnterTransitionEnd,
          })}
        </>
      )
    case TransitionStage.beforeLeaveTransition:
      return (
        <>
          {prevChildren.current && cloneElement(prevChildren.current!, {className: `${props.name}-leave-from ${props.name}-leave-active`})}
        </>
      )
    case TransitionStage.leaveTransitionStart:
      return (
        <>
          {prevChildren.current && cloneElement(prevChildren.current!, {
            className: `${props.name}-leave-to ${props.name}-leave-active`,
            onTransitionEnd: handleLeaveTransitionEnd,
          })}
        </>
      )
  }
}
