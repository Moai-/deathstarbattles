export interface ShardConfig {
  halfLen?: number;
  widthRatio?: number;
  baseHue?: number;
  sat?: number;
  light?: number;
  lightOffsets?: [number, number, number, number];
  alpha?: number;
}

export const createShard = (
  gfx: Phaser.GameObjects.Graphics,
  cfg: ShardConfig = {},
): Phaser.GameObjects.Graphics => {
  const {
    halfLen = Phaser.Math.FloatBetween(12, 40),
    widthRatio = Phaser.Math.FloatBetween(0.25, 0.4),
    baseHue = Phaser.Math.Between(0, 4) > 2
      ? Phaser.Math.Between(0, 33)
      : Phaser.Math.Between(270, 340),
    sat = Phaser.Math.Between(40, 80) / 100,
    light = Phaser.Math.Between(10, 20) / 100,
    lightOffsets = [0, 0.07, 0.04, 0.1],
    alpha = 0.7,
  } = cfg;

  const halfWidth = halfLen * widthRatio;

  const v = [
    { x: 0, y: -halfLen }, // top
    { x: halfWidth, y: 0 }, // right
    { x: 0, y: halfLen }, // bottom
    { x: -halfWidth, y: 0 }, // left
  ];

  const facetColours = lightOffsets.map(
    (dL) =>
      Phaser.Display.Color.HSLToColor(baseHue / 360, sat, light + dL).color,
  );

  const centre = { x: 0, y: 0 };
  const tris = [
    [centre, v[0], v[1]],
    [centre, v[1], v[2]],
    [centre, v[2], v[3]],
    [centre, v[3], v[0]],
  ];

  tris.forEach((tri, idx) => {
    gfx.fillStyle(facetColours[idx]);
    gfx.beginPath();
    gfx.moveTo(tri[0].x, tri[0].y);
    gfx.lineTo(tri[1].x, tri[1].y);
    gfx.lineTo(tri[2].x, tri[2].y);
    gfx.closePath();
    gfx.fillPath();
  });

  return gfx;
};
