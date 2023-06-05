import styles from "@/styles/sectionPage.module.css"
import DScrollpicker from "@/components/DScrollpicker"


export default function DScrollpickerPage(props: any) {


  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <section className={styles.page}>
      <h1>Scroll picker Component</h1>

      <DScrollpicker options={MONTH_NAMES} value={MONTH_NAMES[0]} />
      <p>
        scroll value
      </p>
    </section>
  )
}