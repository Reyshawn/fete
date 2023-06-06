import React, { useState, useEffect, useRef, useCallback } from "react"


// make an element draggable
// add mousedown, mouseup, mousemove event handler, touchstart, touchmove, touchend, touchcancel event handler
// control the drag status
// return the current position {x, y, dx, dy, ax, ay}
interface DraggableStatus {
  x: number
  y: number
  dx: number
  dy: number
  vx: number
  vy: number
  ax: number
  ay: number
  t: number
}

interface DraggableConfiguraiton {
  onDragStart?: (status: DraggableStatus) => void
  onDragging?: (status: DraggableStatus) => void
  onDragEnd?: (status: DraggableStatus) => void
}

const DraggableStatusZero: () => DraggableStatus = () => ({
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  t: 0
})

const defaultConfig: DraggableConfiguraiton = {

}

export const useDraggable = (ref: React.RefObject<HTMLDivElement>, options: DraggableConfiguraiton = defaultConfig) => {
  // console.log("ref current:::", ref.current)

  // const [dragStatus, setDragStatus] = useState<DraggableStatus>(DraggableStatusZero)
  const [rendering, setRendering] = useState(0)
  
  
  // TODO implement queue data structure
  const initDragStatus = useRef<DraggableStatus>(DraggableStatusZero())
  const dragStatusQueue = useRef<DraggableStatus[]>([])
  // const dragStatus = useRef(DraggableStatusZero)
  const isDragging = useRef(false)


  const onDragging = useCallback((event: TouchEvent | MouseEvent) => {
    if (!isDragging) {
      return
    }

    const status = DraggableStatusZero()

    if (event.type === "mousemove") {
      const mouseEvent = event as MouseEvent
      status.x = mouseEvent.clientX
      status.y = mouseEvent.clientY

      status.dx = status.x - initDragStatus.current.x
      status.dy = status.y - initDragStatus.current.y

    } else if (event.type === "touchmove") {


    }

    // console.log("performance.now()::::", performance.now())
    status.t = performance.now()

    const lastStatus = dragStatusQueue.current.at(-1)
    
    if (lastStatus != null ) {
      const dt = status.t - lastStatus.t
      status.vx = (status.dx - lastStatus.dx) / dt
      status.vy = (status.dy - lastStatus.dy) / dt
      status.ax = (status.vx - lastStatus.vx) / dt
      status.ay = (status.vy - lastStatus.vy) / dt
    }

    
    dragStatusQueue.current.push(status)

    if (dragStatusQueue.current.length > 2) {
      dragStatusQueue.current.shift()
    }

    setRendering(i => i+1)

    options.onDragging?.(status)
  }, [])


  useEffect(() => {
    const onDragStart = (event: TouchEvent | MouseEvent) => {
      if (isDragging.current) {
        return
      }

      isDragging.current = true


      ref.current?.addEventListener("mousemove", onDragging)
      ref.current?.addEventListener("touchmove", onDragging)
      

      const status = DraggableStatusZero()
      if (event.type === "mousedown") {
        const mouseEvent = event as MouseEvent
        status.x = mouseEvent.clientX
        status.y = mouseEvent.clientY
  
      } else if (event.type === "touchstart") {
  
        
      } 
      
      // console.log("performance.now()::::123:::", performance.now())
      status.t = performance.now()
      initDragStatus.current = status
      dragStatusQueue.current.push(status)


      options.onDragStart?.(status)


      setRendering(0)
    }
    
    
    const onDragEnd = (event: TouchEvent | MouseEvent) => {
      if (!isDragging.current) {
        return
      }

      isDragging.current = false
      ref.current?.removeEventListener("mousemove", onDragging)
      ref.current?.removeEventListener("touchmove", onDragging)


      // options.onDragEnd?.(dragStatus.current)
    }

    const onDragCancel = (event: TouchEvent | MouseEvent) => {

    }

    ref.current?.addEventListener("mousedown", onDragStart)
    ref.current?.addEventListener("touchstart", onDragStart)
    ref.current?.addEventListener("mouseup", onDragEnd)
    ref.current?.addEventListener("touchend", onDragEnd)
    ref.current?.addEventListener("mouseleave", onDragCancel)
    ref.current?.addEventListener("touchcancel", onDragCancel) 


    return () => {
      ref.current?.removeEventListener("mousedown", onDragStart)
      ref.current?.removeEventListener("touchstart", onDragStart)
      ref.current?.removeEventListener("mouseup", onDragEnd)
      ref.current?.removeEventListener("touchend", onDragEnd)
      ref.current?.removeEventListener("mouseleave", onDragCancel)
      ref.current?.removeEventListener("touchcancel", onDragCancel) 
    }
  }, [ref.current])

  return dragStatusQueue.current.at(-1) ?? DraggableStatusZero()
}
