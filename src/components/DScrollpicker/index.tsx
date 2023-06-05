import React, { useMemo, useRef, useState, useCallback } from "react"
import style from "./style.module.css"

import animate from "@/utils/animate"

interface DScrollpickerProps {
  options: String[]
  value: string
}



// export default function DScrollpicker(props: DScrollpickerProps) {
// 
//   // console.log("render count", i++)
//   
//   const itemHeight = 36
//   const wheelCount = 20
//   const acceleration = 5
// 
//   const itemAngle = useMemo(() => 360 / wheelCount, [wheelCount])
//   const radius = useMemo(() => itemHeight / (2 * Math.sin(itemAngle * Math.PI / 360)), [itemHeight, itemAngle])
//   const halfWheelCount = useMemo(() => wheelCount / 2, [wheelCount])
//   const quarterWheelCount = useMemo(() => wheelCount / 4, [wheelCount])
// 
//   const [scroll, setScroll] = useState(0)
//   
//   const isDragging = useRef(false)
//   const draggingStatus = useRef({y: 0})
//   const scrollLocations = useRef<[number, number][]>([])
// 
// 
//   const cssVars: React.CSSProperties = {
//     '--item-height': itemHeight + 'px',
//     'height': '400px'
//   }
// 
//   const picker = useRef<HTMLDivElement>(null)
// 
//   
// 
//   const handleScroll: React.WheelEventHandler<HTMLDivElement> = () => {
// 
//   }
// 
// 
//   const onPickerMousedown: React.MouseEventHandler<HTMLDivElement> = (event) => {
//     event.preventDefault()
// 
//     isDragging.current = true
// 
//     draggingStatus.current.y = event.clientY
//     picker.current?.addEventListener("mousemove", onPickerMouseMove)
//   }
// 
//   const onPickerMouseUp: React.MouseEventHandler<HTMLDivElement> = (event) => {
//     event.preventDefault()
// 
//     isDragging.current = false
//     // draggingStatus.current.y = 0
//     picker.current?.removeEventListener("mousemove", onPickerMouseMove)
// 
//     handleScrollStop()
//   }
// 
//   const onPickerMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
// 
//   }
// 
// 
//   const onPickerMouseMove = useCallback((event: MouseEvent) => {
//     if (!isDragging.current) {
//       return
//     }
// 
//     const y = event.clientY
//     const deltaY = - y + draggingStatus.current.y
// 
//     console.log("scroll:::1212321", scroll)
//     const s = scroll + (deltaY / itemHeight)
//     setScroll(s)
// 
//     scrollLocations.current.push([s, performance.now()])
// 
//     if (scrollLocations.current.length > 4) {
//       scrollLocations.current.splice(0, 2)
//     }
// 
//   }, [])
// 
// 
//   const handleScrollStop = () => {
//     const length = scrollLocations.current.length
//     const firstLoc  = scrollLocations.current[length - 2]
//     const secondLoc = scrollLocations.current[length - 1]
// 
//     const speed = (secondLoc[0] - firstLoc[0]) * 1000 / (secondLoc[1] - firstLoc[1])
//     animateBy(speed)
//   }
// 
// 
//   const animateBy = (speed: number) => {
//     let initScroll = scroll
//     let finaleScroll
// 
//     let a = speed > 0 ? -acceleration : acceleration
//       
//     let t = Math.abs( speed / a )
// 
//     let d = speed * t + a * t * t / 2
// 
//     finaleScroll = Math.min(Math.max(0, Math.round(initScroll + d)), props.options.length - 1)
// 
//     // this.autoMoving = true
//     animate.fromTo({
//       from: initScroll,
//       to: finaleScroll,
//       duration: t * 1000,
//       easing: x => (1 - Math.pow(1 - x, 2))
//     }, (val, id, done) => {
//         setScroll(val)
//         // this.rafId = id
//         // if (done) {
//         //   this.autoMoving = false
//         // }
//     })
//   }
// 
// 
//   return (
//     <div
//       className={style["d-picker"]}
//       style={cssVars}
//       ref={picker}
//       onWheel={handleScroll}
//       onMouseDown={onPickerMousedown}
//       onMouseUp={onPickerMouseUp}
//       onMouseLeave={onPickerMouseLeave}>
//       <div className={style["d-picker-wheel"]}>
//         <div
//           className={style["d-picker-wheel-rotate"]}
//           style={{
//             'transform': `rotateX(${-1 * itemAngle * scroll}deg)`
//           }}>
//         {
//           props.options.map((option, i) => {
//             return (
//               <div
//                 key={"wh_" + i}
//                 className={style["d-picker-wheel-item"]}
//                 style={{
//                   'transform': `rotateX(${i * itemAngle}deg) translateZ(-${radius}px)`,
//                   'visibility': Math.abs(i - Math.round(scroll)) > halfWheelCount ? 'hidden' : 'visible'
//                 }}>
//                 {option}
//               </div>
//             )
//           })
//         }
//         </div>
//         
//       </div>
//       <div className={style["d-picker-board"]}>
//         <div
//           className={style["d-picker-board-transform"]}
//           style={{
//             'transform': `translateY(${-1 * itemHeight * scroll}px)`
//           }}>
//         {
//           props.options.map((option, index) => {
//             return (
//               <div
//                 key={"board_" + index}
//                 className={style["d-picker-board-option"]}>{option}</div>
//             )
//           })
//         }
//         </div>
//       </div>
//     </div>
//   )
// }


export default class DScrollpicker extends React.Component<DScrollpickerProps, any> {

  onMouseMoveBinded: (event: MouseEvent) => void

  constructor(props: DScrollpickerProps) {
    super(props)
    this.onMouseMoveBinded = this.onPickerMouseMove.bind(this)
  }


  readonly itemHeight = 36
  readonly wheelCount = 20
  readonly acceleration = 5

  isDragging = false
  draggingStatus = {
    y: 0
  }

  picker = React.createRef<HTMLDivElement>()

  state = {
    scroll: 0
  }

  startScroll = 0

  get itemAngle() {
    return 360 / this.wheelCount
  }

  get radius() {
    return this.itemHeight / (2 * Math.sin(this.itemAngle * Math.PI / 360))
  }

  get halfWheelCount() {
    return this.wheelCount / 2
  }

  get quarterWheelCount() {
    return this.wheelCount / 4
  }

  get cssVars() {
    return {
      '--item-height': this.itemHeight + 'px',
      'height': '400px'
    }
  }

  onPickerMousedown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
   
    this.isDragging = true
   
    this.draggingStatus.y = event.clientY
    this.startScroll = this.state.scroll
    this.picker.current?.addEventListener("mousemove", this.onMouseMoveBinded)
  }


  onPickerMouseUp: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
   
    this.isDragging = false
    // draggingStatus.current.y = 0
    this.picker.current?.removeEventListener("mousemove", this.onMouseMoveBinded)
   
    // handleScrollStop()
  }

  onPickerMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
  
  }
  
  
  onPickerMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      return
    }
   
    const y = event.clientY
    const deltaY = - y + this.draggingStatus.y
  

    const s = this.startScroll + (deltaY / this.itemHeight)
    

    console.log("s::::", s)
    this.setState({
      scroll: s
    })
   
    // scrollLocations.current.push([s, performance.now()])
   // 
    // if (scrollLocations.current.length > 4) {
    //   scrollLocations.current.splice(0, 2)
    // }  
  }

  render() {
    return (
      <div
        className={style["d-picker"]}
        style={this.cssVars}
        ref={this.picker}
        onMouseDown={this.onPickerMousedown.bind(this)}
        onMouseUp={this.onPickerMouseUp.bind(this)}
        onMouseLeave={this.onPickerMouseLeave.bind(this)}>
        <div className={style["d-picker-wheel"]}>
          <div
            className={style["d-picker-wheel-rotate"]}
            style={{
              'transform': `rotateX(${-1 * this.itemAngle * this.state.scroll}deg)`
            }}>
          {
            this.props.options.map((option, i) => {
              return (
                <div
                  key={"wh_" + i}
                  className={style["d-picker-wheel-item"]}
                  style={{
                    'transform': `rotateX(${i * this.itemAngle}deg) translateZ(-${this.radius}px)`,
                    'visibility': Math.abs(i - Math.round(this.state.scroll)) > this.halfWheelCount ? 'hidden' : 'visible'
                  }}>
                  {option}
                </div>
              )
            })
          }
          </div>

        </div>
        <div className={style["d-picker-board"]}>
          <div
            className={style["d-picker-board-transform"]}
            style={{
              'transform': `translateY(${-1 * this.itemHeight * this.state.scroll}px)`
            }}>
          {
            this.props.options.map((option, index) => {
              return (
                <div
                  key={"board_" + index}
                  className={style["d-picker-board-option"]}>{option}</div>
              )
            })
          }
          </div>
        </div>
      </div>
      )
    }
}