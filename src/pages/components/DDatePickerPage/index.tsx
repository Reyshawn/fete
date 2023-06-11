import styles from "@/styles/sectionPage.module.css"
import DDatePicker from "@/components/DDatePicker"

export default function DDatepickerPage(props: any) {
  return <section className={styles.page}>
    <h1>Date picker Component</h1>
    <DDatePicker />
</section>
}