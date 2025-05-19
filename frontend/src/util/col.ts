// Converts 0xff0000 to ui32
export function colToUi32(color: number): number {
  return color >>> 0;
}

// Converts ui32 back to hex 0xff0000
export function ui32ToCol(ui32: number): number {
  return ui32 & 0xffffff;
}
