import styles from "@/styles/sectionPage.module.css"
import DScrollpicker from "@/components/DScrollpicker"

import { useState } from "react"

export default function DScrollpickerPage(props: any) {
  // const MONTH_NAMES = [
  //   'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  // ]
  

  let MONTH_NAMES: string[] = []

  for (let i=0; i < 200; i++) {
    MONTH_NAMES.push(`${1900 + i}`)
  }

  const [pickerValue, setPickerValue] = useState(MONTH_NAMES[2])

  return (
    <section className={styles.page}>
      <h1>Scroll picker Component</h1>

      <DScrollpicker options={MONTH_NAMES} value={MONTH_NAMES[2]} onChange={setPickerValue} />
      <p>
        scroll value: {pickerValue}
      </p>
    </section>
  )
}
