import { Colour } from "../types";

// Converts 0xff0000 to ui32
export function colToUi32(colour: number): number {
  return colour >>> 0;
}

// Converts ui32 back to hex 0xff0000
export function ui32ToCol(ui32: number): number {
  return ui32 & 0xffffff;
}

// Converts ui32 to rgb
export const ui32ToRgb =(col: number) => {
  return rgb({
    r: (col >> 16) & 0xff,
    g: (col >> 8) & 0xff,
    b: col & 0xff,
  });
}

export const playerCols = [
  0x00db00, // green 0
  0x00c2c2, // cyan 1
  0xfeff00, // yellow 2
  0xff0000, // red 3
  0xe000e0, // magenta 4
  0x0000f9, // blue 5
  0xffa100, // orange 6
  0x9a9a9a, // gray 7
  0xf1f1f1, // white 8
  0x575757, // dark gray 9
  0xff9a9a, // salmon 10
  0xcc5e00, // bronze 11
];

export const colNames = [
  'green',
  'cyan',
  'yellow',
  'red',
  'magenta',
  'blue',
  'orange',
  'gray',
  'white',
  'dark gray',
  'salmon',
  'bronze',
];

const colourToNumber = ({r, g, b}: Colour) => (r << 16) | (g << 8) | b

// VSCode highlights rgb syntax with a nice colour square
// for example rgb(255,0,0) should be red
// This little helper allows me to declare colours in this format
// and get colour highlighting from VSCode
// Also convert the colour to ui32 format for ECS storage
export const rgb = (r: number | Colour, g: number = 0, b: number = 0): Colour & {num: () => number} => {
  const base = r as Colour;
  const col = typeof r === 'number'
    ? {r, g, b}
    : base;
  return {
    ...col,
    num: () => colourToNumber(col)
  }
}
