
import styles from "@/styles/sectionPage.module.css"
import DColorPicker from "@/components/DColorPicker"


export default function DColorPickerPage(props: any) {
  return <section className={styles.page}>
    <h1>Color picker Component</h1>

    <DColorPicker />
  </section>
}