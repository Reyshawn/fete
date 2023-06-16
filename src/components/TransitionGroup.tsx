import React, { cloneElement, Fragment, useEffect, useRef } from "react"
import { nextFrame } from "./Transition"


interface TransitionGroupProps {
  name: string
  tag: keyof JSX.IntrinsicElements
  children: JSX.Element[]
}





interface TransitionGroupElement {
  node: HTMLElement
  key: React.Key
  action?: "enter" | "leave" | "move"
  onTransitoinEnd?: () => void
}


interface TransitonContext {
  rect: DOMRect
  node: HTMLElement
  position: number
}


export default function TransitionGroup(props: TransitionGroupProps) {
  const Tag = props.tag ?? Fragment
  
  const isMounted = useRef(false)
  const elements = useRef<TransitionGroupElement[]>([])

  const positionMap = useRef(new Map<React.Key, TransitonContext>())
  const parentElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isMounted.current) {
      return
    }

    // compare positionMap and current rendered elements
    elements.current.forEach((ele) => {
      if (!positionMap.current.has(ele.key)) {
        ele.action = "enter"
        return
      }

      const oldRect = positionMap.current.get(ele.key)!.rect
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
        elements.current.forEach((ele, index) => {

          const node = ele.node
          const key = ele.key
    
    
          positionMap.current.set(key, {
            rect: node.getBoundingClientRect(),
            position: index,
            node: ele.node
          })
        })
      })

  })


  useEffect(() => {
    isMounted.current = true

    elements.current.forEach((ele, index) => {

      const node = ele.node
      const key = ele.key


      positionMap.current.set(key, {
        rect: node.getBoundingClientRect(),
        position: index,
        node: ele.node
      })
    })
  } ,[])



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

    for (const ele of elements) {
      switch (ele.action) {
        case "enter":
          ele.node.classList.add(`${name}-enter-from`)
          nextFrame(() => {
            ele.node.classList.add(`${name}-enter-active`)
            ele.node.classList.remove(`${name}-enter-from`)
          })
          break
  
        case "leave":
          ele.node.classList.add(`${name}-leave-from`)
          nextFrame(() => {
            ele.node.classList.add(`${name}-leave-active`)
            ele.node.classList.remove(`${name}-leave-from`)
          })
          break
        case "move":
          nextFrame(() => {
            ele.node.classList.add(`${name}-move`)
            ele.node.style.removeProperty("transform")
          })
          break
      }


      ele.onTransitoinEnd = () => {
        count++
        ele.node.removeEventListener("transitionend", ele.onTransitoinEnd!)
        
        switch (ele.action) {
          case "enter":
            ele.node.classList.remove(`${name}-enter-active`)
            break
          case "leave":
            ele.node.classList.remove(`${name}-leave-active`)
            break
          case "move":
            ele.node.classList.remove(`${name}-move`)
            break
        }

        if (count === animatedElementsCount) {
          resolve(true)
        }
      }
      ele.node.addEventListener("transitionend", ele.onTransitoinEnd)
    }
  })
}
