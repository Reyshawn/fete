import styles from "@/styles/sectionPage.module.css"
import DScrollpicker from "@/components/DScrollpicker"
import DTimepicker from "@/components/DTimepicker"

import { useState } from "react"


export default function DScrollpickerPage(props: any) {
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const [pickerValue, setPickerValue] = useState(MONTH_NAMES[2])

  return (
    <section className={styles.page}>
      <h1>Scroll picker Component</h1>

      <DScrollpicker options={MONTH_NAMES} value={MONTH_NAMES[2]} onChange={setPickerValue} config={{width: "120px"}}/>
      <p>
        scroll value: {pickerValue}
      </p>

      <h1>Date picker Component</h1>
      <DTimepicker />
    </section>
  )
}
