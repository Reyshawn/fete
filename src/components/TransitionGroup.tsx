import React, { cloneElement, Fragment, useEffect, useLayoutEffect, useRef } from "react"
import { nextFrame } from "./Transition"


interface TransitionGroupProps {
  name: string
  tag?: keyof JSX.IntrinsicElements
  children: JSX.Element[]
}


interface TransitionGroupElement {
  node: HTMLElement
  key: React.Key
  action?: "enter" | "leave" | "move"
  onTransitionEnd?: () => void
  onTransitionCancel?: () => void
}


interface TransitonContext {
  rect: DOMRect
  node: HTMLElement
  position: number
  isLeaving?: boolean
}


export default function TransitionGroup(props: TransitionGroupProps) {
  const Tag = props.tag ?? Fragment
  
  const isMounted = useRef(false)
  const elements = useRef<TransitionGroupElement[]>([])

  const positionMap = useRef(new Map<React.Key, TransitonContext>())
  const parentElement = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!isMounted.current) {
      return
    }

    // compare positionMap and current rendered elements

    elements.current.forEach((ele) => resetNode(ele.node, props.name))
    
    elements.current.forEach((ele) => {
      if (!positionMap.current.has(ele.key)) {
        ele.action = "enter"
        return
      }

      const context = positionMap.current.get(ele.key)!

      if (context.isLeaving) {
        ele.action = "enter"
        return
      }

      const oldRect = context.rect
      const newRect = ele.node.getBoundingClientRect()
      const dx = oldRect.x - newRect.x
      const dy = oldRect.y - newRect.y


      if (dx !== 0 || dy !== 0) {
        ele.action = "move"
        ele.node.style.setProperty("transform", `translate(${dx}px, ${dy}px)`)
      }
    })

    const newKeys = elements.current.map(ele => ele.key)

    Array.from(positionMap.current.keys()).forEach((key, index) => {
      if (!newKeys.includes(key)) {
        const context = positionMap.current.get(key)!

        if (context.isLeaving) {
          return
        }

        context.node.classList.add(`${props.name}-leave-active`)
        parentElement.current?.insertBefore(context.node, elements.current[context.position].node)

        elements.current.splice(context.position, 0, {
          node: context.node,
          key: key,
          action: "leave"
        })
      }
    })

    runAnimation(props.name, elements.current, parentElement.current!)
      .then(() => {
      })
      .catch(() => {
        
      })

  })


  useEffect(() => {
    isMounted.current = true

    recordPosition(elements.current, positionMap.current)
  } ,[])


  recordPosition(elements.current, positionMap.current)

  elements.current.forEach((ele) => {
    if (ele.action !== "leave") {
      return
    }

    if (ele.node.classList.contains(`${props.name}-leave-active`)) {
      let context = positionMap.current.get(ele.key)!
      context.isLeaving = true
      context.node.parentElement?.removeChild(context.node)
      return
    }

    
    positionMap.current.delete(ele.key)
  })

  elements.current = []

  return (<Tag>
    {props.children.map((child, index) => (cloneElement(child, {
      ref: (el: HTMLElement | null) => {
        if (el) {
          elements.current[index] = {
            node: el,
            key: child.key as React.Key
          }

          if (parentElement.current == null ) {
            parentElement.current = el.parentElement
          }
        }
      }
    })))}
  </Tag>)
}


function runAnimation(name: string, elements: TransitionGroupElement[], parentNode: HTMLElement) {

  let count = 0
  const animatedElementsCount = elements.filter(ele => ele.action !== undefined).length

  return new Promise((resolve, reject) => {

    for (const ele of elements.filter(ele => ele.action != null)) {
      switch (ele.action) {
        case "enter":
          ele.node.classList.add(`${name}-enter-from`)
          nextFrame(() => {
            ele.node.classList.add(`${name}-enter-active`)
            removeClass(ele.node, `${name}-enter-from`)
          })
          break
  
        case "leave":
          nextFrame(() => {
            ele.node.classList.add(`${name}-leave-to`)
          })
          break
        case "move":
          nextFrame(() => {
            ele.node.classList.add(`${name}-move`)
            ele.node.style.removeProperty("transform")
          })
          break
      }


      ele.onTransitionEnd = () => {
        count++
        ele.node.removeEventListener("transitionend", ele.onTransitionEnd!)
        
        switch (ele.action) {
          case "enter":
            removeClass(ele.node, `${name}-enter-active`)
            break
          case "leave":
            removeClass(ele.node, `${name}-leave-active`)
            removeClass(ele.node, `${name}-leave-to`)
            parentNode.removeChild(ele.node)
            break
          case "move":
            removeClass(ele.node, `${name}-move`)
            break
        }

        if (count === animatedElementsCount) {
          resolve(true)
        }
      }


      ele.onTransitionCancel = () => {
        ele.node.removeEventListener("transitioncancel", ele.onTransitionCancel!)
      }

      ele.node.addEventListener("transitionend", ele.onTransitionEnd)
      ele.node.addEventListener("transitioncancel", ele.onTransitionCancel)
    }
  })
}


function recordPosition(elements: TransitionGroupElement[], positionMap: Map<React.Key, TransitonContext>) {
  if (elements.length === 0) {
    return
  }

  elements
  .filter(ele => ele.action !== "leave")
  .forEach((ele, index) => {
    const node = ele.node
    const key = ele.key


    positionMap.set(key, {
      rect: node.getBoundingClientRect(),
      position: index,
      node: ele.node
    })
  })
}


function resetNode(node: HTMLElement, name: string) {
  // clear all related classes

  removeClass(node, `${name}-enter-from`)
  removeClass(node, `${name}-enter-active`)
  removeClass(node, `${name}-leave-active`)
  removeClass(node, `${name}-leave-to`)
  removeClass(node, `${name}-move`)
}


function removeClass(node: HTMLElement, className: string) {
  node.classList.remove(className)

  if (node.classList.length === 0) {
    node.removeAttribute("class")
  }
}