const generateStarCols = (baseHex, steps) => {
    const base = Phaser.Display.Color.ValueToColor(baseHex);
    const layers = [];
    for (let i = 0; i < steps; i++) {
        const factor = (i + 1 * 2) / steps;
        // Convert to HSV
        const hsv = Phaser.Display.Color.RGBToHSV(base.red, base.green, base.blue);
        // Reduce saturation and brightness
        hsv.s = Phaser.Math.Clamp(hsv.s * (1 - 0.2 * factor), 0, 1);
        hsv.v = Phaser.Math.Clamp(hsv.v * (1 - 0.3 * factor), 0, 1);
        hsv.h = (hsv.h + 0.01 * factor) % 1;
        // Convert back to RGB
        const rgb = Phaser.Display.Color.HSVToRGB(hsv.h, hsv.s, hsv.v);
        // Combine RGB into 0xRRGGBB format
        const color = (rgb.r << 16) | (rgb.g << 8) | rgb.b;
        layers.push(color);
    }
    return layers;
};
export const darkenCol = (hexColor, factor) => {
    const color = Phaser.Display.Color.ValueToColor(hexColor);
    const r = Math.floor(color.red * factor);
    const g = Math.floor(color.green * factor);
    const b = Math.floor(color.blue * factor);
    return (r << 16) | (g << 8) | b;
};
export default generateStarCols;
