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
import { hex, hsv, rgb } from "./helper"
import useRerender from "@/utils/useRerender"


const CANVAS_SIZE = 300
const HUE_SLIDER_HEIGHT = 12
const CURSOR_DIAMETER = 12
const CURSOR_RADIUS = CURSOR_DIAMETER / 2
const HUE_SLIDER_CURSOR_Y = (HUE_SLIDER_HEIGHT - CURSOR_DIAMETER) / 2

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
      <DColorPickerPanel onChange={onHexChange} hex={hexValue} />
    </Popper>
  </div>
  )
}


interface DColorPickerPanelProps {
  onChange?(hex: string): void
  hex?: string
}


function DColorPickerPanel(props: DColorPickerPanelProps) {
  const {
    onChange,
    hex: hexValue = "#ffffff"
  } = props

  const [h, s, v] = hsv(rgb(hexValue))

  const [hueColor, setHueColor] = useState("rgba(255, 0, 0, 1)")
  const [hueNumber, setHueNumber] = useState((h * CANVAS_SIZE / 360))
  const [paletteLoc, setPaletteLoc] = useState([s * CANVAS_SIZE, (1 - v) * CANVAS_SIZE])
  const hasFiredMouseDown = useRef(false)

  const onColorChange = useCallback((color: string) => {
    if (!hasFiredMouseDown.current) {
      return
    }

    onChange?.(hex(color))
  }, [])

  const handlePaletteChange = useCallback((x: number, y: number) => {
    setPaletteLoc([x, y])
  }, [])

  const handleMouseDown = useCallback(() => {
    if (hasFiredMouseDown.current) {
      return
    }

    hasFiredMouseDown.current = true
  }, [])

  return (
    <div className={style["d-color-picker-panel"]} onMouseDownCapture={handleMouseDown}>
      <MemoizedDColorPickerPalette
        hueColor={hueColor}
        onColorChange={onColorChange}
        x={paletteLoc[0]}
        y={paletteLoc[1]}
        onChange={handlePaletteChange} />
      <MemoizedDColorPickerHueSlider x={hueNumber} onHueChange={setHueColor} onChange={setHueNumber} />
    </div>
  )
}


function DColorPickerCursor({x, y, bgColor}: {x: number, y: number, bgColor: string}) {
  return (
    <div className={style["d-color-picker-cursor"]} style={{
      ['--size' as any]: CURSOR_DIAMETER + "px",
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
  }, [props.hueColor])

  useDraggable(parentRef, {
    shouldRerenderOnDragging: false,
    onDragging(status) {
      const _x = Math.min(CANVAS_SIZE, Math.max(0, status.x - initialX.current!))
      const _y = Math.min(CANVAS_SIZE, Math.max(0, status.y - initialY.current!))
      props.onChange(_x, _y)
    }, 
    onDragStart(status) {
      if (initialX.current == null) {
        initialX.current = parentRef.current?.getBoundingClientRect().x!
        initialY.current = parentRef.current?.getBoundingClientRect().y!
      }

      const _x = Math.min(CANVAS_SIZE, Math.max(0, status.x - initialX.current))
      const _y = Math.min(CANVAS_SIZE, Math.max(0, status.y - initialY.current!))
      props.onChange(_x, _y)
    }
  })


  const x = props.x - CURSOR_RADIUS
  const y = props.y - CURSOR_RADIUS

  if (context.current && hueColorRef.current !== props.hueColor) {
    fillColorPalette(context.current, props.hueColor)
    hueColorRef.current = props.hueColor
  }

  let rgb = "rgba(255, 255, 255, 1)"

  if (y === CANVAS_SIZE - CURSOR_RADIUS) {
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

  const setRendering = useRerender()

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
    shouldRerenderOnDragging: false,
    onDragging(status) {
      props.onChange(Math.min(CANVAS_SIZE, Math.max(0, status.x - initialX.current!)))
    }, 
    onDragStart(status) {
      if (initialX.current == null) {
        initialX.current = parentRef.current?.getBoundingClientRect().x!
      }

      props.onChange(Math.min(CANVAS_SIZE, Math.max(0, status.x - initialX.current!)))
    }
  })

  const x = props.x

  let rgb = "rgba(255, 0, 0, 1)"
  if (context.current && x < CANVAS_SIZE && x > 0) {
    const imageData = context.current.getImageData(x, 0, 1, 1).data
    rgb = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`
  }

  useEffect(() => {
    setRendering()
  }, [context.current])

  useEffect(() => {
    props.onHueChange?.(rgb)
  }, [rgb])

  return (
    <div
      style={{
        width: CANVAS_SIZE + "px",
        height: HUE_SLIDER_HEIGHT + "px"
      }}
      className={style["d-color-picker-panel-hue-slider"]}
      ref={parentRef}>
      <canvas ref={hueSliderRef} width={CANVAS_SIZE} height={HUE_SLIDER_HEIGHT}></canvas>
      <DColorPickerCursor x={x - CURSOR_RADIUS} y={HUE_SLIDER_CURSOR_Y} bgColor={rgb}/>
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


const MemoizedDColorPickerHueSlider = memo(DColorPickerHueSlider)
const MemoizedDColorPickerPalette = memo(DColorPickerPalette)
