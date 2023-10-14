import { ForwardedRef, forwardRef, memo, MouseEventHandler, useCallback, useState } from "react"
import style from "./style.module.css"
import "./style.css"

import TransitionGroup from "@/components/TransitionGroup"
import ArrowLeftIcon from '@/assets/svg/dp_arrow_left.svg'
import ArrowRightIcon from '@/assets/svg/dp_arrow_right.svg'
import CalendarIcon from "@/assets/svg/calendar.svg"
import usePopper from "@/utils/usePopper"
import Popper from "../Popper"



const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


const YEAR_TRANSFORM = [
  -42, // January
  -30, // February
  -52, // March
  -63, // April
  -68, // May
  -65, // June
  -72, // July
  -45, // August
  -12, // September
  -35, // October
  -17, // November
  -17, // December
]


export default function DatePicker(props: any) {
  const { getAnchorProps, getPopperProps } = usePopper<HTMLDivElement>()

  return (
    <>
      <MemoizedDatePickerInput {...getAnchorProps()} />
      <Popper {...getPopperProps()}>
        <DatePickerDateView />
      </Popper>
    </>
  )
}

interface DatePickerInputProps {
  onClick: MouseEventHandler<HTMLDivElement>
}

function DatePickerInput({ onClick }: DatePickerInputProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div className={style["date-picker"]} onClick={onClick} ref={ref}>
      <div className="relative">
        <input type="hidden" name="date"/>
        <input
          type="text"
          readOnly
          className={style["date-picker-input"]}
          placeholder="Select date" />
        <div className="absolute top-0 right-0 px-3 py-2">
          <CalendarIcon /> 
        </div>

      </div>
    </div>
  )
}

const MemoizedDatePickerInput = memo(forwardRef(DatePickerInput))


function DatePickerYearView(props: any) {

}


function DatePickerMonthView(props: any) {
  
}



function DatePickerDateView(props: any) {
  
  const [year, setYear] = useState(2023)
  const [month, setMonth] = useState(0)

  const [action, setAction] = useState("")

  const nextMonth = useCallback(() => {
    setAction("next")
    if (month === 11) {
      setMonth(0)
      setYear(year => year + 1)
    } else {
      setMonth(month => month + 1)
    }
  }, [month])

  const prevMonth = useCallback(() => {
    setAction("prev")
    if (month === 0) {
      setMonth(11)
      setYear(year => year - 1)
    } else {
      setMonth(month => month - 1)
    }
    
  }, [month])


  const [blankDays, numOfDays] = getNumOfDays(year, month)


  return (
    <div className={style["date-picker-panel"]}>
      <div className={style["date-picker-panel-header"]}>
        <div className="cursor-pointer select-none flex items-center">
          <div className={["date-picker-month-label", action].join(" ")}>
            <TransitionGroup name="date-picker-month-label-slide">
              <span
                 key={`month_label_${year}-${month}`} 
                 className={style["date-picker-panel-header__current-month"]}>
                 { MONTH_NAMES[month] }
              </span>
            </TransitionGroup>
          </div>
          <span
            className={style["date-picker-panel-header__current-year"]}
            style={{
              transform: `translateX(${YEAR_TRANSFORM[month]}px)`
            }}
          >
            { year }
          </span>
        </div>
        <div>
          <button type="button"
            onClick={prevMonth}
            className="t-icon">
              <ArrowLeftIcon />
          </button>
          <button type="button"
            onClick={nextMonth}
            className="t-icon">
            <ArrowRightIcon />
          </button>
        </div>
      </div>

    <div className={[
      style["date-picker-panel-view"],
      style["date-picker-panel-month-view"]].join(" ")}>
      <div className={style["date-picker-panel-week-label"]}>
        { DAYS.map((day, index) => (
          <div
              style={{"width": "14.26%"}}
              className="px-1"
              key={"week_" + index}>
            <div className="text-gray-800 font-medium text-center text-xs" >{ day }</div>
          </div>)) }
      </div>

      <div className={[style["date-picker-panel-slide"], "date-picker-panel-slide", action].join(" ")}>
        <TransitionGroup name="date-picker-panel-slide">
          <div className={style["date-picker-panel-days"]} key={`${year}-${month}`}>
          { blankDays.map((_, index) => (
            <div
              key={'blankday' + index}
              className={style["date-picker-panel-days-unit"]} />)) }
          { numOfDays.map((date, i) => (
            <div
              key={'days_' + i}
              className={style["date-picker-panel-days-unit"]}>
              <div
                className={style["date-picker-panel-days-day"]}>
                { date }
              </div>
            </div>)) }
          </div>
        </TransitionGroup>
      </div>
      
    </div>

    </div>
  )
}



function getNumOfDays(year: number, month: number): [number[], number[]] {
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  // find where to start calendar day of week
  let dayOfWeek = new Date(year, month).getDay();
  let blankdaysArray = [];
  for ( let i=1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
  }

  let daysArray = [];
  for ( let i=1; i <= daysInMonth; i++) {
      daysArray.push(i);
  }

  return [blankdaysArray, daysArray]
}
