import { makeId } from "shared/src/utils";
import { Depths } from "../types";
import { AnyPoint } from "shared/src/types";

export type JetStyle = {
  length: number;
  innerRadius: number; // Where the jet begins
  spreadRad: number; // Full angle of the V (in radians). Smaller = narrower
  layers?: number; // How many nested wedges to stack (more = smoother edge falloff)
  slices?: number; // How many slices along the length (more = smoother striations + fade)
  coreAlpha?: number; // Max alpha in the core
  edgeAlpha?: number; // Min alpha on the edge
  falloffPow?: number; // Nonlinear falloff for brightness towards edges (higher = tighter core)
  endFadeFrac?: number; // Portion of `length` used for fading out at the end (0..1)
  outerFadeBias?: number; // How much earlier the OUTER layers start fading (0..1)
  striationStrength?: number;
  striationFineness?: number; // How fine striations are (0..1). Higher = more rapid flicker per slice
  coreBoost?: number; // makes the very center slightly brighter overall (0..1)
  padding?: number; // Extra padding (px) around render texture
  depth?: number;
};
export const drawJet = (
  scene: Phaser.Scene,
  loc: AnyPoint,
  color: number,
  angleRad: number,
  style: JetStyle,
) => {
  const {
    length,
    innerRadius,
    spreadRad,
    layers = 14,
    slices = 36,
    coreAlpha = 0.6,
    edgeAlpha = 0.02,
    falloffPow = 2.3,
    endFadeFrac = 0.22,
    outerFadeBias = 0.75,
    striationStrength = 0.35,
    striationFineness = 0.65,
    coreBoost = 0.15,
    padding = 6,
    depth = Depths.GFX,
  } = style;

  const x0 = innerRadius;
  const x1 = innerRadius + length;

  const maxR = x1;
  const size = Math.ceil((maxR + padding) * 2);

  const rt = scene.make.renderTexture({ width: size, height: size }).setVisible(false);
  const g = scene.add.graphics().setVisible(false);

  const cx = size / 2;
  const cy = size / 2;

  // Fade region at the end of the jet
  const baseFadeLen = Math.max(1, length * Phaser.Math.Clamp(endFadeFrac, 0, 1));

  // Helpers
  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

  // Slightly smoother random than raw Math.random for "banding"
  const randSigned = () => (Math.random() - 0.5) * 2; // -1..1

  for (let layer = 0; layer < layers; layer++) {
    const t = layer / Math.max(1, layers - 1);
    const kCore = t;
    const halfAngle = (spreadRad * 0.5) * (0.22 + 0.78 * (1 - kCore));
    const baseA = edgeAlpha + (coreAlpha - edgeAlpha) * Math.pow(kCore, falloffPow);
    const boostedBaseA = baseA * (1 + coreBoost * kCore);
    const fadeScale = 1 - outerFadeBias * kCore; 
    const fadeLen = Phaser.Math.Clamp(baseFadeLen * fadeScale, 1, length);
    const fadeStart = x1 - fadeLen;

    const sliceCount = Math.max(6, Math.floor(slices));
    const dx = (x1 - x0) / sliceCount;
    let layerPhase = Math.random() * Math.PI * 2;

    for (let s = 0; s < sliceCount; s++) {
      const xa = x0 + s * dx;
      const xb = x0 + (s + 1) * dx;
      const xm = (xa + xb) * 0.5;
      let endFade = 1;
      if (xm >= fadeStart) {
        endFade = 1 - (xm - fadeStart) / Math.max(1e-6, x1 - fadeStart);
        endFade = clamp01(endFade);
      }

      if (endFade <= 0.001) continue;

      const fineness = Phaser.Math.Clamp(striationFineness, 0, 1);
      const strength = Phaser.Math.Clamp(striationStrength, 0, 1);
      const freq = Phaser.Math.Linear(0.35, 2.2, fineness);
      const band = Math.sin(layerPhase + s * freq) * 0.55 + randSigned() * 0.45;
      const coreStriation = strength * (0.25 + 0.75 * kCore);
      const striationMul = 1 + band * coreStriation * 0.35;
      const a = boostedBaseA * endFade * clamp01(striationMul);

      if (a <= 0.001) continue;

      const ya = Math.tan(halfAngle) * (xa - x0);
      const yb = Math.tan(halfAngle) * (xb - x0);

      g.fillStyle(color, a);
      g.beginPath();
      g.moveTo(cx + xa, cy - ya);
      g.lineTo(cx + xb, cy - yb);
      g.lineTo(cx + xb, cy + yb);
      g.lineTo(cx + xa, cy + ya);
      g.closePath();
      g.fillPath();
    }
  }

  rt.draw(g);
  g.destroy(true);

  const texId = makeId();
  rt.saveTexture(texId);

  return scene.add
    .image(loc.x, loc.y, texId)
    .setOrigin(0.5, 0.5)
    .setRotation(angleRad)
    .setDepth(depth);
};