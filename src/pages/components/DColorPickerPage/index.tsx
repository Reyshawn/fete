
import styles from "@/styles/sectionPage.module.css"
import ColorPicker from "@/components/ColorPicker"


export default function DColorPickerPage(props: any) {
  return <section className={styles.page}>
    <h1>Color picker Component</h1>

    <ColorPicker />
  </section>
}