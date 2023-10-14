import styles from "@/styles/sectionPage.module.css"
import ScrollPicker from "@/components/ScrollPicker"
import TimePicker from "@/components/TimePicker"

import { useState } from "react"


export default function DScrollpickerPage(props: any) {
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const [pickerValue, setPickerValue] = useState(MONTH_NAMES[2])

  return (
    <section className={styles.page}>
      <h1>Scroll picker Component</h1>

      <ScrollPicker options={MONTH_NAMES} value={MONTH_NAMES[2]} onChange={setPickerValue} config={{width: "120px"}}/>
      <p>
        scroll value: {pickerValue}
      </p>

      <h1>Date picker Component</h1>
      <TimePicker />
    </section>
  )
}
