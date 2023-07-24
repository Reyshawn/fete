const componentToHex = (c: number) => {
  return c.toString(16).padStart(2, '0')
}

function decodeRGB(rgb: string) {
  const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/
  const partsRGB = rgb.match(rgbRegex)

  if (partsRGB == null) {
    throw "rgba format is not right!"
  }

  const red = Number(partsRGB[1])
  const green = Number(partsRGB[2])
  const blue = Number(partsRGB[3])

  return [red, green, blue]
}


export function hex(rgb: string) {
  return "#" + decodeRGB(rgb).map(componentToHex).join("")
}


export function rgb(hex: string): [number, number, number] {
  if (!/^#[0-9A-F]{6}$/i.test('#AABBCC')) {
    throw "hex format is not right"
  }

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return [r, g, b]
}

export function hsl(rgb: [number, number, number]) {
  let [r, g, b] = rgb
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ]
}