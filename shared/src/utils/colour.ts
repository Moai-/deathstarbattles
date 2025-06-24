// Converts 0xff0000 to ui32
export function colToUi32(color: number): number {
  return color >>> 0;
}

// Converts ui32 back to hex 0xff0000
export function ui32ToCol(ui32: number): number {
  return ui32 & 0xffffff;
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

type Col = { r: number; b: number; g: number };
export const generateRandomCol = (base: Col, bias: Col) => {
  const r = base.r + Math.floor(Math.random() * bias.r);
  const g = base.g + Math.floor(Math.random() * bias.g);
  const b = base.b + Math.floor(Math.random() * bias.b);

  return (r << 16) | (g << 8) | b;
};
