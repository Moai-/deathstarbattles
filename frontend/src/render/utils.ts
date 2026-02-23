export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const sampleDiskBiased = (rnd: () => number, biasPower = 2.2) => {
  const u = rnd();
  const r = Math.pow(u, 1 / biasPower);
  const a = rnd() * Math.PI * 2;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, r };
};

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const makeLCG = (seed: number) => {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

export const stampFeathered = (
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  r: number,
  color: number,
  alpha: number,
  rings: number = 7,
) => {
  // Gaussian-ish radial falloff. Outer rings are faint; inner rings carry most energy.
  // IMPORTANT: no (1/rings) normalization — we want the stamp to still be visible.
  for (let k = 0; k < rings; k++) {
    const t = k / (rings - 1);          // 0..1
    const rr = r * (1 - t * 0.92);
    const w = Math.exp(-3.5 * (1 - t) * (1 - t)); // heavier weight near center
    const aa = alpha * w * 0.55;        // 0.55 is a good baseline; tune 0.4..0.9
    g.fillStyle(color, aa);
    g.fillCircle(x, y, rr);
  }
};