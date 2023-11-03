import style from "./style.module.css"
import Popper from "@/components/Popper"
import { useCallback, useEffect, useRef, useState, memo } from "react"
import { useDraggable } from "@fete/hooks"
import { hex, hsv, rgb } from "./helper"
import { useRerender } from "@fete/hooks"
import usePopper from "@/utils/usePopper"


const CANVAS_SIZE = 200
const SLIDER_HEIGHT = 12
const CURSOR_DIAMETER = 12
const CURSOR_RADIUS = CURSOR_DIAMETER / 2
const SLIDER_CURSOR_Y = (SLIDER_HEIGHT - CURSOR_DIAMETER) / 2

export default function ColorPicker(props: any) {
  const [hexValue, setHexValue] = useState("#ffffff")
  const [alphaValue, setAlphaValue] = useState(100) // (0, 100)

  const { getAnchorProps, getPopperProps } = usePopper<HTMLDivElement>()

  return (
  <div className={style["color-picker"]}>
    <div
      className={style["color-picker-indicator"]}
      style={{
        backgroundColor: `rgba(${rgb(hexValue).join(",")}, ${alphaValue}%`,
      }}
      {...getAnchorProps()}></div>
    <span>{hexValue}</span>
    <span>{alphaValue}%</span>
    <Popper {...getPopperProps()}>
      <ColorPickerPanel onHexChange={setHexValue} hex={hexValue} onAlphaChange={setAlphaValue} alpha={alphaValue} />
    </Popper>
  </div>
  )
}


interface ColorPickerPanelProps {
  onHexChange(hex: string): void
  hex: string
  onAlphaChange(alpha: number): void
  alpha: number
}


function ColorPickerPanel(props: ColorPickerPanelProps) {
  const {
    onAlphaChange,
    alpha: alphaValue,
    onHexChange,
    hex: hexValue = "#ffffff"
  } = props

  const [h, s, v] = hsv(rgb(hexValue))

  const [hueColor, setHueColor] = useState("rgba(255, 0, 0, 1)")
  const [hueNumber, setHueNumber] = useState((h * CANVAS_SIZE / 360))
  const [alphaNumber, setAlphaNumber] = useState(alphaValue * CANVAS_SIZE / 100)

  const [paletteLoc, setPaletteLoc] = useState([s * CANVAS_SIZE, (1 - v) * CANVAS_SIZE])
  const hasFiredMouseDown = useRef(false)

  const onColorChange = useCallback((color: string) => {
    if (!hasFiredMouseDown.current) {
      return
    }

    onHexChange(hex(color))
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

  useEffect(() => {
    onAlphaChange(Math.min(100, Math.max(0, Number((alphaNumber * 100 / CANVAS_SIZE).toFixed(2)))))
  }, [alphaNumber])


  return (
    <div className={style["color-picker-panel"]} onMouseDownCapture={handleMouseDown}>
      <MemoizedColorPickerPalette
        hueColor={hueColor}
        onColorChange={onColorChange}
        x={paletteLoc[0]}
        y={paletteLoc[1]}
        onChange={handlePaletteChange} />
      <MemoizedColorPickerHueSlider x={hueNumber} onHueChange={setHueColor} onChange={setHueNumber} />
      <MemoizedColorPickerAlphaSlider hex={hexValue} x={alphaNumber} onChange={setAlphaNumber} />
    </div>
  )
}


function ColorPickerCursor({x, y, bgColor}: {x: number, y: number, bgColor: string}) {
  return (
    <div className={style["color-picker-cursor"]} style={{
      ['--size' as any]: CURSOR_DIAMETER + "px",
      left: x + "px",
      top: y + "px",
      backgroundColor: bgColor
    }}></div>
  )
}


interface ColorPickerPaletteProps {
  hueColor: string
  onColorChange?(color: string): void
  x: number
  y: number
  onChange(x: number, y: number): void
}


function ColorPickerPalette(props: ColorPickerPaletteProps) {
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
    <div
      style={{
        ['--size' as any]: CANVAS_SIZE + "px",
      }}
      className={style["color-picker-panel-color-palette"]}
      ref={parentRef}>
      <canvas ref={paletteRef} width={CANVAS_SIZE} height={CANVAS_SIZE}></canvas>
      <ColorPickerCursor x={x} y={y} bgColor={rgb} />
    </div>
  )
}


interface ColorPickerHueSliderProps {
  onHueChange?(color: string): void
  x: number // range: [0, CANVAS_SIZE]
  onChange(hueNumber: number): void
}


function ColorPickerHueSlider(props: ColorPickerHueSliderProps) {
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
        height: SLIDER_HEIGHT + "px"
      }}
      className={style["color-picker-panel-hue-slider"]}
      ref={parentRef}>
      <canvas ref={hueSliderRef} width={CANVAS_SIZE} height={SLIDER_HEIGHT}></canvas>
      <ColorPickerCursor x={x - CURSOR_RADIUS} y={SLIDER_CURSOR_Y} bgColor={rgb}/>
    </div>
  )
}


interface ColorPickerAlphaSlider {
  hex: string
  x: number // range: [0, CANVAS_SIZE]
  onChange(alphaNumber: number): void
}

function ColorPickerAlphaSlider(props: ColorPickerAlphaSlider) {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const { hex: hexValue, x } = props
  const rgbString = rgb(hexValue).join(", ")
  const initialX = useRef<number | null>(null)

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

  return (
    <div
      ref={parentRef}
      style={{
        width: CANVAS_SIZE + "px",
        height: SLIDER_HEIGHT + "px"
      }}
      className={style["color-picker-panel-alpha-slider"]}
    >
      <div 
      className={style["color-picker-panel-alpha-slider-gradient"] }
      style={{
        background: `linear-gradient(to right, rgba(${rgbString}, 0) 0%, rgb(${rgbString}) 100%)`
      }}></div>
      <ColorPickerCursor x={x - CURSOR_RADIUS} y={SLIDER_CURSOR_Y} bgColor={`rgba(${rgbString}, ${x / CANVAS_SIZE})`}/>
    </div>
  )
}


function fillColorPalette(context: CanvasRenderingContext2D, color: string) {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
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


const MemoizedColorPickerHueSlider = memo(ColorPickerHueSlider)
const MemoizedColorPickerPalette = memo(ColorPickerPalette)
const MemoizedColorPickerAlphaSlider = memo(ColorPickerAlphaSlider)
