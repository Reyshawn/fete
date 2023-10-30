import styles from "@/styles/sectionPage.module.css"
import TransitionGroup from "@/components/TransitionGroup"
import { useRef, useState } from "react"


export default function ListAnimationPage() {
  return <section className={styles.page}>
    <h1>List Animation</h1>
    <ListAnimationDemo />
  </section>
}


enum ListTransitionType {
  shuffle = "shuffle",
  mutation = "list-mutation"
}


function ListAnimationDemo() {
  const [values, setValues] = useState([1, 2, 3, 4, 5, 6, 7])

  const countRef = useRef(values.length)

  const transitionType = useRef(ListTransitionType.shuffle)

  const handleInsert = () => {

    const plusIndex = Math.floor(Math.random() * values.length)
    const newValues = [...values]
    newValues.splice(plusIndex, 0, countRef.current + 1)

    countRef.current++

    transitionType.current = ListTransitionType.mutation
    setValues(newValues)
  }

  const handleRemove = () => {
    const removeIndex = Math.floor(Math.random() * values.length)

    const newValues = [...values]
    newValues.splice(removeIndex, 1)

    transitionType.current = ListTransitionType.mutation
    setValues(newValues)
  }

  const handleShuffle = () => {
    const newValues = [...shuffle(values)]

    transitionType.current = ListTransitionType.shuffle
    setValues(newValues)
  }


  return (
    <div style={{
      height: "500px",
      maxHeight: "500px",
      overflow: "auto"
    }}>
      <button onClick={handleInsert}>insert</button>
      <button onClick={handleRemove}>remove</button>
      <button onClick={handleShuffle}>shuffle</button>
      <ul style={{ 
        position: "relative",
      }}>
        <TransitionGroup name={transitionType.current}>
          {
            values.map((i, index) => 
            <li
              key={"k-" + i}
              style={{
                borderRadius: "4px",
                marginTop: "2px",
                backgroundColor: "#363062",
                color: "white",
                width: "100%",
                height: "30px",
                willChange: "opacity, transform"
              }}
            >
              - {i}
            </li>)
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
