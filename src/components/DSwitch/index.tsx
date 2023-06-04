import style from "./style.module.css"


interface DSwitchProp {
  value: boolean,
  setValue: Function
}

export default function DSwitch(props: DSwitchProp) {
  const _switch = () => {
    props.setValue(!props.value)
  }

  return (
    <div className={style["btn-status"]} onClick={_switch}>
     <input
        type="checkbox"
        name="checkbox"
        checked={props.value}
        className={[style["switch-input"], "hidden"].join(" ")} />
      <label htmlFor="checkbox" className={style["btn-change"]}></label>
    </div>
  )
}