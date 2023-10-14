import style from "./style.module.css"
import {
  offset,
  flip,
  shift,
} from '@floating-ui/react-dom'

import { useState } from "react"
import ScrollPicker from "../ScrollPicker"
import Popper from "@/components/Popper"
import usePopper from "@/utils/usePopper"


const HOURS = Array.from(Array<never>(24).keys()).map(i => String(i).padStart(2, '0'))
const MINUTES = Array.from(Array<never>(60).keys()).map(i => String(i).padStart(2, '0'))
const SECONDS = Array.from(Array<never>(60).keys()).map(i => String(i).padStart(2, '0'))


interface TimePickerProps {
  hour?: string
  minute?: string
  second?: string
  onChange?: (val: string) => void
}


function displayTimeFrom(hour?: string, minute?: string, second?: string) {
  return `${hour ?? HOURS[0]}: ${minute ?? MINUTES[0]}: ${second ?? SECONDS[0]}`
}


export default function TimePicker(props: TimePickerProps) {
  const [hour, setHour] = useState(props.hour ?? HOURS[0])
  const [minute, setMinute] = useState(props.minute ?? MINUTES[0])
  const [second, setSecond] = useState(props.second ?? SECONDS[0])

  const { getAnchorProps, getPopperProps } = usePopper<HTMLInputElement>({
    placement: "bottom-start",
    middleware: [offset(10), shift(), flip()]
  })
  
  const displayValue = displayTimeFrom(hour, minute, second)
  props.onChange?.(displayValue)

  return (
    <div className={style["time-picker"]}>
      <input
        type="text"
        {...getAnchorProps()}
        readOnly
        value={displayValue} />
        <Popper {...getPopperProps()}>
          <div className={style["time-picker-panel"]}>
            <div className={style["time-picker-panel-picker"]}>
              <div className={style["time-picker-panel-picker-label"]}>
                HOUR
              </div>
              <ScrollPicker options={HOURS} value={hour ?? HOURS[0]} onChange={setHour} />
            </div>
            <div className={style["time-picker-panel-picker"]}>
              <div className={style["time-picker-panel-picker-label"]}>
                MINUTE
              </div>
              <ScrollPicker options={MINUTES} value={minute ?? MINUTES[0]} onChange={setMinute} />
            </div>
            <div className={style["time-picker-panel-picker"]}>
              <div className={style["time-picker-panel-picker-label"]}>
                SECOND
              </div>
              <ScrollPicker options={SECONDS} value={second ?? SECONDS[0]} onChange={setSecond} />
            </div>
          </div>
        </Popper>
    </div>
  )
} 
