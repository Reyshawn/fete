import styles from "@/styles/sectionPage.module.css"
import TransitionGroup from "@/components/TransitionGroup"
import { useCallback, useState } from "react"
import Transition from "@/components/Transition"


export default function ListAnimationPage() {
  return <section className={styles.page}>
    <h1>Insert Random</h1>
    <InsertRandomDemo />
    <h1>Remove Random</h1>
    <RemoveRandomDemo />
    <h1>Shuffle</h1>
    <ShuffleDemo />
  </section>
}


function InsertRandomDemo() {
  const [values, setValues] = useState([1, 2, 3, 4, 5, 6, 7])

  const handleClick = () => {

    const plusIndex = Math.floor(Math.random() * values.length)
    const newValues = [...values]
    newValues.splice(plusIndex, 0, newValues.length + 1)

    setValues(newValues)
  }


  return (
    <div style={{
      height: "500px",
      maxHeight: "500px",
      overflow: "auto"
    }}>
      <button onClick={handleClick}>insert</button>
      <ul style={{ position: "relative" }}>
        <TransitionGroup name="shuffle">
          {
            values.map((i, index) => <li key={"k-" + i} data-key={"k-" + i} style={{ border: "1px solid teal", width: "100%", height: "30px" }}>- {i}</li>)
          }
        </TransitionGroup>
      </ul>

    </div>
  )
}


function RemoveRandomDemo() {
  const [values, setValues] = useState([1, 2, 3, 4, 5, 6, 7])

  const handleClick = () => {


    const removeIndex = Math.floor(Math.random() * values.length)

    const newValues = [...values]
    console.log("values:::", values.length)
    console.log("removeIndex:::", removeIndex)
    newValues.splice(removeIndex, 1)

    setValues(newValues)
  }


  return (
    <div style={{
      height: "500px",
      maxHeight: "500px",
      overflow: "auto"
    }}>
      <button onClick={handleClick}>insert</button>
      <ul style={{ position: "relative" }}>
        <TransitionGroup name="shuffle">
          {
            values.map((i, index) => <li key={"k-" + i} data-key={"k-" + i} style={{ border: "1px solid teal", width: "100%", height: "30px" }}>- {i}</li>)
          }
        </TransitionGroup>
      </ul>

    </div>
  )
}


function ShuffleDemo() {
  const [values, setValues] = useState([1, 2, 3, 4, 5, 6, 7])

  const handleClick = () => {
    const newValues = [...shuffle(values)]

    setValues(newValues)
  }


  return (
    <div style={{
      height: "500px",
      maxHeight: "500px",
      overflow: "auto"
    }}>
      <button onClick={handleClick}>insert</button>
      <ul style={{ position: "relative" }}>
        <TransitionGroup name="shuffle">
          {
            values.map((i, index) => <li key={"k-" + i} data-key={"k-" + i} style={{ border: "1px solid teal", width: "100%", height: "30px" }}>- {i}</li>)
          }
        </TransitionGroup>
      </ul>

    </div>
  )
}


function shuffle<T>(array: T[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
