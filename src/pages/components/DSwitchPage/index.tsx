import { useState } from "react"
import DSwitch from "@/components/DSwitch"
import styles from "@/styles/sectionPage.module.css"

export default function DSwitchPage(props: any) {
  const [state, setState] = useState<boolean>(true)

  return (
    <section className={styles.page}>
      <h1>Switch Component</h1>
      <DSwitch value={state} setValue={setState} />

      <p>
        switch value: {state.toString()}
      </p>

      <button onClick={() => setState(!state)}>click</button>
    </section>
  )
}