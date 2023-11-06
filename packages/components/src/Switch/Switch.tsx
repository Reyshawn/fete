import { Dispatch, SetStateAction } from "react"
import style from "./Switch.module.css"


interface SwitchProp {
  value: boolean,
  onChange: Dispatch<SetStateAction<boolean>>
}

export default function Switch(props: SwitchProp) {
  const { value, onChange } = props

  return (
    <div className={style["btn-status"]} onClick={() => onChange(!value)}>
     <input
        type="checkbox"
        name="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
        className={[style["switch-input"], "hidden"].join(" ")} />
      <label htmlFor="checkbox" className={style["btn-change"]}></label>
    </div>
  )
}
