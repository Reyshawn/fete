import style from "./style.module.css"
import {
  useFloating,
  offset,
  flip,
  shift,
} from '@floating-ui/react-dom'
import Popper from "@/components/Popper"
import { useCallback, useEffect, useRef, useState, memo } from "react"
import useClickAway from "@/utils/useClickAway"
import { useDraggable } from "@/utils/useDraggable"
import { hex, hsl, rgb } from "./helper"

export default function DColorPicker(props: any) {
  const [isPanelShown, setIsPanelShown] = useState(false)
  const [hexValue, setHexValue] = useState("#ffffff")

  const {refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(10), shift(), flip()]
  })

  useClickAway(refs.floating, (event) => {
    if (event.target !== refs.reference.current) {
      setIsPanelShown(false)
    } 
  })


  const onHexChange = useCallback((hex: string) => {
    setHexValue(hex)
  }, [])

  const [h, l, s] = hsl(rgb(hexValue))


  return (
  <div className={style["d-color-picker"]}>
    <div
      className={style["d-color-picker-indicator"]}
      style={{
        backgroundColor: hexValue
      }}
      ref={refs.setReference}
      onClick={() => setIsPanelShown(true)}></div>
    <span>{hexValue}</span>

    <Popper active={isPanelShown}  setFloating={refs.setFloating} floatingStyles={floatingStyles}>
      <MemoizedDColorPickerPanel onChange={onHexChange} />
    </Popper>
  </div>
  )
}


interface DColorPickerPanelProps {
  onChange?(hex: string): void
  // hue: number
  // saturation: number
  // lightness: number
}


function DColorPickerPanel(props: DColorPickerPanelProps) {
  const [baseColor, setBaseColor] = useState("rgba(255, 0, 0, 1)")

  const onHueChange = useCallback((color: string) => {
    setBaseColor(color)
  }, [])

  const onColorChange = useCallback((color: string) => {
    // props.onChange?.(hex(color))
  }, [])


  return (
    <div className={style["d-color-picker-panel"]}>
      <DColorPickerPalette baseColor={baseColor} onColorChange={onColorChange} />
      <DColorPickerHueSlider hue={0} onHueChange={onHueChange} />
    </div>
  )
}

const MemoizedDColorPickerPanel = memo(DColorPickerPanel)


function DColorPickerCursor({x, y, bgColor}: {x: number, y: number, bgColor: string}) {
  return (
    <div className={style["d-color-picker-cursor"]} style={{
      left: x + "px",
      top: y + "px",
      backgroundColor: bgColor
    }}></div>
  )
}


interface DColorPickerPaletteProps {
  baseColor: string
  onColorChange?(color: string): void
}


function DColorPickerPalette(props: DColorPickerPaletteProps) {

  const parentRef = useRef<HTMLDivElement | null>(null)
  const paletteRef = useRef<HTMLCanvasElement | null>(null)
  const initialX = useRef<number | null>(null)
  const initialY = useRef<number | null>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)


  useEffect(() => {
    // fill color palette
    const palette = paletteRef.current!
    const paletteContext = palette.getContext("2d")!
    context.current = paletteContext

    const width = palette.width
    const height = palette.height

    paletteContext.rect(0, 0, width, height)

    paletteContext.fillStyle = props.baseColor
    paletteContext.fillRect(0, 0, width, height)

    const gradientWhite = paletteContext.createLinearGradient(0, 0, width, 0)
    gradientWhite.addColorStop(0, 'rgba(255,255,255,1)')
    gradientWhite.addColorStop(1 / width, 'rgba(255,255,255,1)')
    gradientWhite.addColorStop(1 - 1 / width, 'rgba(255,255,255,0)')
    gradientWhite.addColorStop(1, 'rgba(255,255,255,0)')
    paletteContext.fillStyle = gradientWhite
    paletteContext.fillRect(0, 0, width, height)

    const gradientBlack = paletteContext.createLinearGradient(0, 0, 0, height)
    gradientBlack.addColorStop(0, 'rgba(0,0,0,0)')
    gradientWhite.addColorStop(1 / width, 'rgba(0,0,0,0)')
    gradientWhite.addColorStop(1 - 1 / width, 'rgba(0,0,0,1)')
    gradientBlack.addColorStop(1, 'rgba(0,0,0,1)')
    paletteContext.fillStyle = gradientBlack
    paletteContext.fillRect(0, 0, width, height)
  }, [props.baseColor])

  const status = useDraggable(parentRef, {
    shouldCancelOnMouseLeave: false,
    onDragStart() {
      if (initialX.current == null) {
        initialX.current = parentRef.current?.getBoundingClientRect().x!
        initialY.current = parentRef.current?.getBoundingClientRect().y!
      }
    }
  })

  let x = -6 
  let y = -6

  if (initialX.current != null) {
    x = Math.min(294, Math.max(-6, status.x - initialX.current - 6))
    y = Math.min(294, Math.max(-6, status.y - initialY.current! - 6))
  }

  let rgb = "rgba(255, 255, 255, 1)"

  if (y === 294) {
    rgb = "rgba(0, 0, 0, 1)"
  } else if (context.current) {
    const imageData = context.current.getImageData(Math.min(299, x+6), Math.min(299, y+6), 1, 1).data
    rgb = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`
  }

  props.onColorChange?.(rgb)

  return (
    <div className={style["d-color-picker-panel-color-palette"]} ref={parentRef}>
      <canvas ref={paletteRef} width={300} height={300}></canvas>
      <DColorPickerCursor x={x} y={y} bgColor={rgb} />
    </div>
  )
}


interface DColorPickerHueSliderProps {
  onHueChange?(color: string): void
  hue: number
}


function DColorPickerHueSlider(props: DColorPickerHueSliderProps) {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const hueSliderRef = useRef<HTMLCanvasElement | null>(null)
  const initialX = useRef<number | null>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    // fill hue slider
    const hueSlider = hueSliderRef.current!
    const hueSliderContext = hueSlider.getContext("2d")!
    context.current = hueSliderContext
    hueSliderContext.rect(0, 0, hueSlider.width, hueSlider.height)
    const hueGradient = hueSliderContext.createLinearGradient(0, 0, hueSlider.width, 0)
    hueGradient.addColorStop(0, 'rgba(255, 0, 0, 1)')
    hueGradient.addColorStop(1 / 6, 'rgba(255, 255, 0, 1)')
    hueGradient.addColorStop(2 / 6, 'rgba(0, 255, 0, 1)')
    hueGradient.addColorStop(3 / 6, 'rgba(0, 255, 255, 1)')
    hueGradient.addColorStop(4 / 6, 'rgba(0, 0, 255, 1)')
    hueGradient.addColorStop(5 / 6, 'rgba(255, 0, 255, 1)')
    hueGradient.addColorStop(1, 'rgba(255, 0, 0, 1)')
    hueSliderContext.fillStyle = hueGradient
    hueSliderContext.fill()

  }, [])

  const status = useDraggable(parentRef, {
    shouldCancelOnMouseLeave: false,
    onDragStart() {
      if (initialX.current == null) {
        initialX.current = parentRef.current?.getBoundingClientRect().x!
      }
    }
  })

  let x = -6
  if (initialX.current != null) {
    x = Math.min(294, Math.max(-6, status.x - initialX.current - 6))
  }

  let rgb = "rgba(255, 0, 0, 1)"
  if (context.current && x < 294 && x > 0) {

    const imageData = context.current.getImageData(x+6, 0, 1, 1).data
    rgb = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`
  }

  props.onHueChange?.(rgb)

  return (
    <div className={style["d-color-picker-panel-hue-slider"]} ref={parentRef}>
      <canvas ref={hueSliderRef} width={300} height={12}></canvas>
      <DColorPickerCursor x={x} y={0} bgColor={rgb}/>
    </div>
  )
}
