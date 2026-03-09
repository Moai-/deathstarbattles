import { GameWorld } from "shared/src/ecs/world";

type HueTypes = 'reds' | 'purples' | 'blues';

export type StarOptions = {
  hue?: HueTypes | number;
  bri?: number;
  sat?: number;
  size?: number;
  x: number;
  y: number;
}

export const drawStar = (world: GameWorld, gfx: Phaser.GameObjects.Graphics, opts: StarOptions) => {
  const {hue: optHue, bri, sat, size, x, y} = opts;
  const reds = world.random.between(0, 33);
  const purples = world.random.between(270, 340);
  const blues = world.random.between(230, 260);
  const hue = typeof optHue === 'string'
    ? optHue === 'reds'
      ? reds
      : optHue === 'purples'
        ? purples
        : blues
    : typeof optHue === 'number'
      ? optHue
      : world.random.between(0, 4) > 2 ? reds : purples;
  const radius = size ?? world.random.betweenFloat(0.3, 5);

  const saturation = sat ?? world.random.between(40, 80);
  const lightness = bri ?? world.random.between(10, 20);
  const color = Phaser.Display.Color.HSLToColor(
    hue / 360,
    saturation / 100,
    lightness / 100,
  ).color;
  gfx.fillStyle(color);
  gfx.fillCircle(x, y, radius)
}