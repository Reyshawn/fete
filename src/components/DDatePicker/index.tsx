import { useCallback, useState } from "react"
import style from "./style.module.css"
import "./style.css"

import TransitionGroup from "@/components/TransitionGroup"


const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


export default function DDatePicker(props: any) {
  return (<>


  <div className={style["d-datepicker"]}>
    <div className="relative">
      <input type="hidden" name="date"/>
      <input
        type="text"
        readOnly
        className={style["d-datepicker-input"]}
        placeholder="Select date" />
      <div className="absolute top-0 right-0 px-3 py-2">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
    </div>
  </div>

  <DDatePickerDateView />
  </>
    
  )
}



function DDatePickerInput(props: any) {




}


function DDatePickerYearView(props: any) {

}


function DDatePickerMonthView(props: any) {
  
}



function DDatePickerDateView(props: any) {
  
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
    <div className={style["d-datepicker-panel"]}>
      <div className={style["d-datepicker-panel-header"]}>
        <div className="cursor-pointer select-none">
          <span
            className={style["d-datepicker-panel-header__current-month"]}>
            { MONTH_NAMES[month] }&nbsp;
          </span>
          <span
            className={style["datepicker-panel-header__current-year"]}>
            { year }
          </span>
        </div>
        <div>
          <button type="button"
            onClick={prevMonth}
            className="t-icon">
              <svg x="0px" y="0px" viewBox="0 0 443.52 443.52">
	<g>
		<path d="M143.492,221.863L336.226,29.129c6.663-6.664,6.663-17.468,0-24.132c-6.665-6.662-17.468-6.662-24.132,0l-204.8,204.8
			c-6.662,6.664-6.662,17.468,0,24.132l204.8,204.8c6.78,6.548,17.584,6.36,24.132-0.42c6.387-6.614,6.387-17.099,0-23.712
			L143.492,221.863z"/>
	</g>
</svg>
          </button>
          <button type="button"
            onClick={nextMonth}
            className="t-icon">
              <svg x="0px" y="0px"
	 viewBox="0 0 443.52 443.52">
<g>
	<path d="M336.226,209.591l-204.8-204.8c-6.78-6.548-17.584-6.36-24.132,0.42c-6.388,6.614-6.388,17.099,0,23.712l192.734,192.734
		L107.294,414.391c-6.663,6.664-6.663,17.468,0,24.132c6.665,6.663,17.468,6.663,24.132,0l204.8-204.8
		C342.889,227.058,342.889,216.255,336.226,209.591z"/>
</g>
</svg>
          </button>
        </div>
      </div>



    <div className={[
      style["d-datepicker-panel-view"],
      style["d-datepicker-panel-month-view"]].join(" ")}>
      <div className={style["d-datepicker-panel-week-label"]}>
        {
          DAYS.map((day, index) => (<div
            style={{"width": "14.26%"}}
            className="px-1"
            key={"week_" + index}>
            <div className="text-gray-800 font-medium text-center text-xs" >{ day }</div>
          </div>))
        }
      </div>

      <div className={[style["d-datepicker-panel-slide"], "d-datepicker-panel-slide", action].join(" ")}>
        <TransitionGroup name="d-datepicker-panel-slide">
        {
          [month].map(_ => (
          <div className={style["d-datepicker-panel-days"]} key={`${year}-${month}`}>
          {
            blankDays.map((_, index) => (
            <div
              key={'blankday' + index}
              className={style["d-datepicker-panel-days-unit"]}></div>))
          }
          {
            numOfDays.map((date, i) => (
            <div
              key={'days_' + i}
              className={style["d-datepicker-panel-days-unit"]}>
              <div
                className={style["d-datepicker-panel-days-day"]}>
                { date }
              </div>
            </div>))
          }
          </div>
          ))
        }
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
