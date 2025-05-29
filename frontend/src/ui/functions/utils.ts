export const toHTMLHex = (colorInt: number) => {
  return `#${colorInt.toString(16).padStart(6, '0')}`;
};
