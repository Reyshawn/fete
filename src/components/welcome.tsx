import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { incremented, decremented, selectCount, selectStatus, fetchPosts } from '../store';


function Welcome (props: any) {

  const count = useSelector(selectCount);
  const status = useSelector(selectStatus)
  const dispatch = useDispatch();


  useEffect(() => {
    console.log(`count update ${count}`)
  }, [count])

  return <div>
    <h1>Hello, {props.name}, { count }</h1>
    <button onClick={() => dispatch(incremented("123aaa"))}>click this</button>

    <button onClick={() => dispatch(decremented())}>click this</button><br/>

    <h2>{status}</h2>

    <button onClick={() => dispatch(fetchPosts("fetch some payload"))}>fetch</button>
  </div>
}

export default Welcome