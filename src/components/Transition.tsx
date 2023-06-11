import { useRef, cloneElement, useState, useEffect, useCallback } from "react"

interface TransitionProps {
  name: string
  children: JSX.Element
  if: boolean
}


enum TransitionStage {
  beforeEnterTransition = 1, // apply enter-from enter-active classname
  enterTransitionStart, // apply enter-to enter-active classname
  beforeLeaveTransition, //  apply leave-from leave-active classname
  leaveTransitionStart, // apply leave-to leave-active classname 
  notMounted,
  mounted
}


function nextFrame(cb: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}


export default function Transition(props: TransitionProps) {
  const [stage, setStage] = useState<TransitionStage>(TransitionStage.notMounted)
  const isMounted = useRef(false)

  // TODO
  // If the transition didn't really start, stage will remain at the `.enterTransitionStart`
  const handleEnterTransitionEnd = useCallback(() => {
    setStage(TransitionStage.mounted)
  }, [])


  // TODO
  // If the transition didn't really start, stage will remain at the `.leaveTransitionStart`
  const handleLeaveTransitionEnd = useCallback(() => {
    setStage(TransitionStage.notMounted)
  }, [])

  const beginEnterTransition = useCallback(() => {
    if (stage !== TransitionStage.notMounted) {
      setStage(TransitionStage.mounted)
      return
    }

    setStage(TransitionStage.beforeEnterTransition)
    nextFrame(() => {
      setStage(TransitionStage.enterTransitionStart)
    })
  }, [stage])


  const beginLeaveTransition = useCallback(() => {
    if (stage !== TransitionStage.mounted) {
      setStage(TransitionStage.notMounted)
      return
    }

    setStage(TransitionStage.beforeLeaveTransition)
    nextFrame(() => {
      setStage(TransitionStage.leaveTransitionStart)
    })
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


  useEffect(() => {
    if (props.if) {
      beginEnterTransition()

    } else {
      // console.log("render nothing")
    }
    isMounted.current = true
  } ,[])


  switch (stage) {
    case TransitionStage.notMounted:
      return <></>
    case TransitionStage.mounted:
      return <>{props.children}</>
    case TransitionStage.beforeEnterTransition:
      return (
        <>
          {cloneElement(props.children, {className: `${props.name}-enter-from ${props.name}-enter-active`})}
        </>
      )
    case TransitionStage.enterTransitionStart:
      return (
        <>
          {cloneElement(props.children, {
            className: `${props.name}-enter-to ${props.name}-enter-active`,
            onTransitionEnd: handleEnterTransitionEnd,
          })}
        </>
      )
    case TransitionStage.beforeLeaveTransition:
      return (
        <>
          {cloneElement(props.children, {className: `${props.name}-leave-from ${props.name}-leave-active`})}
        </>
      )
    case TransitionStage.leaveTransitionStart:
      return (
        <>
          {cloneElement(props.children, {
            className: `${props.name}-leave-to ${props.name}-leave-active`,
            onTransitionEnd: handleLeaveTransitionEnd,
          })}
        </>
      )
  }
}
