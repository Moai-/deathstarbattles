type HueTypes = 'reds' | 'purples' | 'blues';

export type StarOptions = {
  big?: boolean;
  hue?: HueTypes | number;
  bri?: number;
  x: number;
  y: number;
}

export const drawStar = (gfx: Phaser.GameObjects.Graphics, opts: StarOptions) => {
  const {big, hue: optHue, bri, x, y} = opts;
  const reds = Phaser.Math.Between(0, 33);
  const purples = Phaser.Math.Between(270, 340);
  const blues = Phaser.Math.Between(230, 260);
  const hue = typeof optHue === 'string'
    ? optHue === 'reds'
      ? reds
      : optHue === 'purples'
        ? purples
        : blues
    : typeof optHue === 'number'
      ? optHue
      : Phaser.Math.Between(0, 4) > 2 ? reds : purples;
  const radius = big
    ? Phaser.Math.FloatBetween(0.3, 5)
    : Phaser.Math.FloatBetween(5, 9);

  const saturation = Phaser.Math.Between(40, 80);
  const lightness = bri || Phaser.Math.Between(10, 20);
  const color = Phaser.Display.Color.HSLToColor(
    hue / 360,
    saturation / 100,
    lightness / 100,
  ).color;
  gfx.fillStyle(color);
  gfx.fillCircle(x, y, radius)
}