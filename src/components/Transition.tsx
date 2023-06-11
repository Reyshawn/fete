import { useRef, cloneElement, useState, useEffect, useCallback } from "react"

interface TransitionProps {
  name: string
  children: JSX.Element | null
  in: boolean
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
  const prevChildren = useRef<JSX.Element | null>(null)

  const handleEnterTransitionEnd = useCallback(() => {
    setStage(TransitionStage.mounted)
  }, [])


  const handleLeaveTransitionEnd = useCallback(() => {
    setStage(TransitionStage.notMounted)
    prevChildren.current = null
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
    prevChildren.current = props.children

    if (stage !== TransitionStage.mounted && stage !== TransitionStage.enterTransitionStart) {
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

    if (props.in) {
      beginEnterTransition()
    } else {
      beginLeaveTransition()
    }
  }, [props.in])


  useEffect(() => {
    if (props.in) {
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
          {props.children && cloneElement(props.children!, {className: `${props.name}-enter-from ${props.name}-enter-active`})}
        </>
      )
    case TransitionStage.enterTransitionStart:
      return (
        <>
          {props.children && cloneElement(props.children!, {
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
