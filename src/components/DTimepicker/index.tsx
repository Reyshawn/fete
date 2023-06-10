import style from "./style.module.css"
import {
  useFloating,
  offset,
  flip,
  shift,
} from '@floating-ui/react-dom';

import { useState } from "react";
import { createPortal } from "react-dom"
import DScrollpicker from "../DScrollpicker"
import useClickAway from "@/utils/useClickAway";


const HOURS = Array.from(Array<never>(24).keys()).map(i => String(i).padStart(2, '0'))
const MINUTES = Array.from(Array<never>(60).keys()).map(i => String(i).padStart(2, '0'))
const SECONDS = Array.from(Array<never>(60).keys()).map(i => String(i).padStart(2, '0'))


interface DTimepickerProps {
  hour?: string
  minute?: string
  second?: string
  onChange?: (val: string) => void
}


function displayTimeFrom(hour?: string, minute?: string, second?: string) {
  return `${hour ?? HOURS[0]}: ${minute ?? MINUTES[0]}: ${second ?? SECONDS[0]}`
}


export default function DTimepicker(props: DTimepickerProps) {
  const [isTimepickerShown, setIsTimepickerShown] = useState(false)
  const [hour, setHour] = useState(props.hour ?? HOURS[0])
  const [minute, setMinute] = useState(props.minute ?? MINUTES[0])
  const [second, setSecond] = useState(props.second ?? SECONDS[0])

  const {refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(10), shift(), flip()]
  })

  useClickAway(refs.floating, (_) => {
    setIsTimepickerShown(false)
  })
  
  const displayValue = displayTimeFrom(hour, minute, second)
  props.onChange?.(displayValue)

  return (
    <div className={style["d-timepicker"]}>
      <input
        type="text"
        ref={refs.setReference}
        onClick={() => setIsTimepickerShown(true)}
        readOnly
        value={displayValue} />  
      {createPortal(isTimepickerShown ? 
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={style["d-timepicker-panel"]}>
        
        <div className={style["d-timepicker-panel-picker"]}>
          <div className={style["d-timepicker-panel-picker-label"]}>
            HOUR
          </div>
          <DScrollpicker options={HOURS} value={hour ?? HOURS[0]} onChange={setHour} />
        </div>
        <div className={style["d-timepicker-panel-picker"]}>
          <div className={style["d-timepicker-panel-picker-label"]}>
            MINUTE
          </div>
          <DScrollpicker options={MINUTES} value={minute ?? MINUTES[0]} onChange={setMinute} />
        </div>
        <div className={style["d-timepicker-panel-picker"]}>
          <div className={style["d-timepicker-panel-picker-label"]}>
            SECOND
          </div>
          <DScrollpicker options={SECONDS} value={second ?? SECONDS[0]} onChange={setSecond} />
        </div>
      </div> : null, document.body)}
    </div>
  )
} 
