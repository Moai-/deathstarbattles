import { makeId } from "shared/src/utils";
import { Depths } from "../types";
import generateStarCols, { darkenCol } from "./starCols";

type AnyPoint = { x: number; y: number };

export type AccretionDiskStyle = {
  outerRadius: number; // Outer radius of the disk (px). Usually a bit bigger than star
  innerRadius: number; // Inner / star radius
  thickness?: number; // How thin the disk looks (scaleY). 0.25–0.45 is a good range.
  alpha?: number; // Overall brightness
  bands?: number;
  turbulence?: number; // 0..1
  glowFrac?: number; // 0..1
  depth?: number;
};

export const drawAccretionDisk = (
  scene: Phaser.Scene,
  loc: AnyPoint,
  baseColor: number,
  style: AccretionDiskStyle,
) => {
  const {
    outerRadius,
    innerRadius,
    thickness = 0.33,
    alpha = 1,
    bands = 7,
    turbulence = 0.75,
    glowFrac = 0.18,
    depth = Depths.GFX,
  } = style;

  // Texture size (pad for glow)
  const glowPad = outerRadius * glowFrac;
  const maxR = outerRadius + glowPad;
  const size = Math.ceil(maxR * 2);

  const rt = scene.make
    .renderTexture({ width: size, height: size })
    .setVisible(false);

  rt.clear();

  const g = scene.add.graphics().setVisible(false);

  const cx = size / 2;
  const cy = size / 2;

  // Palette
  const cols = generateStarCols(baseColor, Math.max(6, bands + 2));
  const hot = cols[0];
  const mid = cols[Math.floor(cols.length * 0.35)];
  const cool = cols[Math.floor(cols.length * 0.7)];
  const glowCol = cols[cols.length - 1];

  const glowDots = 220;
  for (let i = 0; i < glowDots; i++) {
    const t = i / glowDots;
    const ang = t * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
    const r = outerRadius + (Math.random() - 0.2) * glowPad;

    const px = cx + Math.cos(ang) * r;
    const py = cy + Math.sin(ang) * r;

    const dotR = Phaser.Math.Linear(glowPad * 0.18, glowPad * 0.5, Math.random());
    const a = alpha * Phaser.Math.Linear(0.01, 0.05, Math.random());

    g.fillStyle(glowCol, a);
    g.fillCircle(px, py, dotR);
  }

  const steps = 260;
  for (let b = 0; b < bands; b++) {
    const bandT = b / Math.max(1, bands - 1);
    const r0 = Phaser.Math.Linear(outerRadius, innerRadius, bandT);
    const r1 = r0 - Phaser.Math.Linear(outerRadius * 0.06, outerRadius * 0.12, Math.random());
    const bandR = Math.max(innerRadius, (r0 + r1) * 0.5);

    const colPick = cols[Math.floor(Phaser.Math.Linear(cols.length - 2, 1, bandT))];
    const baseA = alpha * Phaser.Math.Linear(0.03, 0.10, 1 - bandT);

    // Segment drawing: we draw small quadrilateral strips around the ring
    for (let s = 0; s < steps; s++) {
      const t0 = s / steps;
      const t1 = (s + 1) / steps;

      const a0 = t0 * Math.PI * 2;
      const a1 = t1 * Math.PI * 2;

      const turb = turbulence * Phaser.Math.Linear(0.35, 1.0, 1 - bandT);
      const jitter0 = (Math.random() - 0.5) * turb * outerRadius * 0.03;
      const jitter1 = (Math.random() - 0.5) * turb * outerRadius * 0.03;

      const hotspot = 1 + (Math.random() - 0.5) * turb * 0.9;
      const localA = baseA * Phaser.Math.Clamp(hotspot, 0.2, 1.8);

      if (Math.random() < 0.02 * turb) continue;

      const ro0 = r0 + jitter0;
      const ro1 = r0 + jitter1;
      const ri0 = r1 + jitter0 * 0.7;
      const ri1 = r1 + jitter1 * 0.7;

      const x0o = cx + Math.cos(a0) * ro0;
      const y0o = cy + Math.sin(a0) * ro0;
      const x1o = cx + Math.cos(a1) * ro1;
      const y1o = cy + Math.sin(a1) * ro1;

      const x1i = cx + Math.cos(a1) * ri1;
      const y1i = cy + Math.sin(a1) * ri1;
      const x0i = cx + Math.cos(a0) * ri0;
      const y0i = cy + Math.sin(a0) * ri0;

      // Slightly bias inner bands to be brighter at random angles
      const innerBoost = (1 - bandT) * (0.6 + 0.8 * Math.random());

      g.fillStyle(darkenCol(colPick, 0.08), Phaser.Math.Clamp(localA * innerBoost, 0, 0.22));
      g.beginPath();
      g.moveTo(x0o, y0o);
      g.lineTo(x1o, y1o);
      g.lineTo(x1i, y1i);
      g.lineTo(x0i, y0i);
      g.closePath();
      g.fillPath();
    }

    g.lineStyle(Phaser.Math.Linear(2, 1, bandT), mid, alpha * Phaser.Math.Linear(0.10, 0.03, bandT));
    g.beginPath();
    g.arc(cx, cy, bandR, 0, Math.PI * 2);
    g.strokePath();
  }

  // Inner center
  g.fillStyle(0x000000, alpha * 0.55);
  g.fillCircle(cx, cy, innerRadius);

  // Bake
  rt.draw(g);
  g.destroy(true);

  const texId = makeId();
  rt.saveTexture(texId);
  rt.destroy();

  // Place as an image
  const img = scene.add
    .image(loc.x, loc.y, texId)
    .setOrigin(0.5, 0.5)
    .setDepth(depth);

  // Squash into a disk (ellipse) to look "edge-on"
  img.setScale(1, thickness);
  return img;
};