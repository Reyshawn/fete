import React from 'react'
import './style.scss'


export default function Like () {


  return (
    <div className="like-button">
      <input id="toggle-heart" type="checkbox" />
      <label htmlFor="toggle-heart">❤</label>
    </div>
  )
}