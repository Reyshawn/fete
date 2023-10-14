import styles from "@/styles/sectionPage.module.css"
import DatePicker from "@/components/DatePicker"

export default function DDatepickerPage(props: any) {
  return <section className={styles.page}>
    <h1>Date picker Component</h1>
    <DatePicker />
  </section>
}