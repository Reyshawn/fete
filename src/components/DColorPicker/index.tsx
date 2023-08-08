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


const CANVAS_SIZE = 300

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
      <DColorPickerPanel onChange={onHexChange} />
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
  const [hueColor, setHueColor] = useState("rgba(255, 0, 0, 1)")
  const [hueNumber, setHueNumber] = useState(0)
  const [paletteLoc, setPaletteLoc] = useState([0, 0])

  const onHueChange = useCallback((color: string) => {
    setHueColor(color)
  }, [])

  const onColorChange = useCallback((color: string) => {
    props.onChange?.(hex(color))
  }, [])


  return (
    <div className={style["d-color-picker-panel"]}>
      <DColorPickerPalette
        hueColor={hueColor}
        onColorChange={onColorChange}
        x={paletteLoc[0]}
        y={paletteLoc[1]}
        onChange={(x, y) => setPaletteLoc([x, y])} />
      <DColorPickerHueSlider x={hueNumber} onHueChange={onHueChange} onChange={setHueNumber} />
    </div>
  )
}


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
  hueColor: string
  onColorChange?(color: string): void
  x: number
  y: number
  onChange(x: number, y: number): void
}


function DColorPickerPalette(props: DColorPickerPaletteProps) {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const paletteRef = useRef<HTMLCanvasElement | null>(null)
  const initialX = useRef<number | null>(null)
  const initialY = useRef<number | null>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  
  const hueColorRef = useRef(props.hueColor)

  useEffect(() => {
    // fill color palette
    const palette = paletteRef.current!
    const paletteContext = palette.getContext("2d", {willReadFrequently: true})!
    context.current = paletteContext
    hueColorRef.current = props.hueColor

    paletteContext.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    fillColorPalette(paletteContext, props.hueColor)
  }, [])

  useDraggable(parentRef, {
    onDragging(status) {
      if (initialX.current != null) {
        const _x = Math.min(CANVAS_SIZE, Math.max(0, status.x - initialX.current))
        const _y = Math.min(CANVAS_SIZE, Math.max(0, status.y - initialY.current!))
        props.onChange(_x, _y)
      }
    }, 
    onDragStart(status) {
      if (initialX.current == null) {
        initialX.current = parentRef.current?.getBoundingClientRect().x!
        initialY.current = parentRef.current?.getBoundingClientRect().y!
      }
    }
  })

  const x = props.x - 6
  const y = props.y - 6


  if (context.current && hueColorRef.current !== props.hueColor) {
    fillColorPalette(context.current, props.hueColor)
    hueColorRef.current = props.hueColor
  }

  let rgb = "rgba(255, 255, 255, 1)"

  if (y === CANVAS_SIZE - 6) {
    rgb = "rgba(0, 0, 0, 1)"
  } else if (context.current) {
    const imageData = context.current.getImageData(Math.min(CANVAS_SIZE - 1, x+6), y+6, 1, 1).data
    rgb = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`
  }

  useEffect(() => {
    props.onColorChange?.(rgb)
  }, [rgb])

  return (
    <div className={style["d-color-picker-panel-color-palette"]} ref={parentRef}>
      <canvas ref={paletteRef} width={CANVAS_SIZE} height={CANVAS_SIZE}></canvas>
      <DColorPickerCursor x={x} y={y} bgColor={rgb} />
    </div>
  )
}


interface DColorPickerHueSliderProps {
  onHueChange?(color: string): void
  x: number // range: [0, CANVAS_SIZE]
  onChange(hueNumber: number): void
}


function DColorPickerHueSlider(props: DColorPickerHueSliderProps) {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const hueSliderRef = useRef<HTMLCanvasElement | null>(null)
  const initialX = useRef<number | null>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    // fill hue slider
    const hueSlider = hueSliderRef.current!
    const hueSliderContext = hueSlider.getContext("2d", {willReadFrequently: true})!
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

  useDraggable(parentRef, {
    shouldCancelOnMouseLeave: false,
    onDragging(status) {
      if (initialX.current != null) {
        props.onChange(Math.min(CANVAS_SIZE, Math.max(0, status.x - initialX.current)))
      }
    }, 
    onDragStart() {
      if (initialX.current == null) {
        initialX.current = parentRef.current?.getBoundingClientRect().x!
      }
    }
  })

  const x = props.x - 6

  let rgb = "rgba(255, 0, 0, 1)"
  if (context.current && x < CANVAS_SIZE - 6 && x > 0) {
    const imageData = context.current.getImageData(x+6, 0, 1, 1).data
    rgb = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`
  }

  useEffect(() => {
    props.onHueChange?.(rgb)
  }, [rgb])

  return (
    <div className={style["d-color-picker-panel-hue-slider"]} ref={parentRef}>
      <canvas ref={hueSliderRef} width={CANVAS_SIZE} height={12}></canvas>
      <DColorPickerCursor x={x} y={0} bgColor={rgb}/>
    </div>
  )
}


function fillColorPalette(context: CanvasRenderingContext2D, color: string) {
  context.fillStyle = color
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  const gradientWhite = context.createLinearGradient(0, 0, CANVAS_SIZE, 0)
  gradientWhite.addColorStop(0, 'rgba(255,255,255,1)')
  gradientWhite.addColorStop(1 / CANVAS_SIZE, 'rgba(255,255,255,1)')
  gradientWhite.addColorStop(1 - 1 / CANVAS_SIZE, 'rgba(255,255,255,0)')
  gradientWhite.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradientWhite
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  const gradientBlack = context.createLinearGradient(0, 0, 0, CANVAS_SIZE)
  gradientBlack.addColorStop(0, 'rgba(0,0,0,0)')
  gradientWhite.addColorStop(1 / CANVAS_SIZE, 'rgba(0,0,0,0)')
  gradientWhite.addColorStop(1 - 1 / CANVAS_SIZE, 'rgba(0,0,0,1)')
  gradientBlack.addColorStop(1, 'rgba(0,0,0,1)')
  context.fillStyle = gradientBlack
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
}