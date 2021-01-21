import React from 'react'

function Welcome (props: any) {

  const [count, setCount] = React.useState(0)
  const [date, setDate] = React.useState(new Date())

  React.useEffect(() => {
    console.log("Hello");

    const interval = setInterval(() => {
      setDate(new Date())
    }, 100)

    return () => {
      console.log("Bye");
      clearInterval(interval)
    };
  }, [])


  React.useEffect(() => {
    console.log(`count update ${count}`)
  }, [count])

  return <div>
    <h1>Hello, {props.name}, { count }</h1>
    <button onClick={() => setCount(count + 1)}>click this</button>
    <div>{date.toLocaleTimeString()}</div>
  </div>
}

export default Welcome