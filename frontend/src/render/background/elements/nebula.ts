import { clamp01, lerp, makeLCG, sampleDiskBiased, smoothstep } from "src/render/utils";

export type NebulaOptions = {
  x: number;
  y: number;

  // Overall size of the nebula footprint (local space)
  radius?: number;          // px
  aspect?: number;          // 0.3..1.6 (stretches cloud)
  rotation?: number;        // radians
  tilt?: number;            // 0 = round, 1 = very squashed (optional "sheet" look)

  // Look
  hue?: number;             // 0..360 base pastel hue
  hueSpread?: number;       // how much the hue varies across puffs (deg)
  alpha?: number;           // overall opacity multiplier
  vividness?: number;       // 0..1 increases contrast and glow
  glowEdges?: boolean;

  // Structure
  puffCount?: number;       // medium-scale structure count
  detailCount?: number;     // smaller-scale detail
  dustCount?: number;       // dark lanes / pockets
  rimCount?: number;        // glowing edge accents

  seed?: number;
};


// pastel-ish HSL helper
const hslColor = (h: number, s: number, l: number) =>
  Phaser.Display.Color.HSLToColor(((h % 360) + 360) % 360 / 360, s / 100, l / 100).color;

export const drawNebula = (g: Phaser.GameObjects.Graphics, opts: NebulaOptions) => {
  const radius = opts.radius ?? Phaser.Math.FloatBetween(220, 520);

  const aspect = opts.aspect ?? Phaser.Math.FloatBetween(0.65, 1.35);
  const tilt = clamp01(opts.tilt ?? Phaser.Math.FloatBetween(0, 0.7));
  const axisRatio = lerp(1.0, 0.35, tilt);

  const rotation = opts.rotation ?? Phaser.Math.FloatBetween(0, Math.PI * 2);

  const alpha = opts.alpha ?? 1;
  const vividness = clamp01(opts.vividness ?? 0.75);

  const hue = opts.hue ?? Phaser.Math.Between(185, 330);
  const hueSpread = opts.hueSpread ?? lerp(18, 55, vividness);

  const puffCount = opts.puffCount ?? Math.floor(lerp(45, 95, vividness));
  const detailCount = opts.detailCount ?? Math.floor(lerp(120, 260, vividness));
  const dustCount = opts.dustCount ?? Math.floor(lerp(25, 70, vividness));
  const rimCount = opts.rimCount ?? Math.floor(lerp(18, 45, vividness));

  const glowEdges = opts.glowEdges ?? true;

  const rnd =
    opts.seed == null ? Math.random : makeLCG(opts.seed);

  // local drawing around (0,0)
  g.setPosition(opts.x, opts.y);
  g.setRotation(rotation);
  g.setScale(aspect, axisRatio);

  // 1. Big base gas fields (soft pastel layers)
  const baseLayers = 16;
  for (let i = 0; i < baseLayers; i++) {
    const t = i / (baseLayers - 1);
    const inv = 1 - t;

    const r = lerp(radius * 0.95, radius * 0.25, Math.pow(t, 0.9));
    const a = Math.pow(inv, 1.9) * lerp(0.05, 0.095, vividness) * alpha;

    // moderate saturation, higher lightness than galaxy
    const h = hue + (rnd() - 0.5) * (hueSpread * 0.35);
    const s = lerp(42, 28, t);
    const l = lerp(18, 34, t);

    g.fillStyle(hslColor(h, s, l), a);
    g.fillCircle(0, 0, r);
  }

  // 2. Medium puffs (structure / turbulence)
  for (let i = 0; i < puffCount; i++) {
    // puff distribution: not too centered; biasPower < 2 pushes outward a bit
    const p = sampleDiskBiased(rnd, 1.45);
    const rNorm = p.r;

    const x = p.x * radius * 0.95 + (rnd() - 0.5) * radius * 0.08;
    const y = p.y * radius * 0.95 + (rnd() - 0.5) * radius * 0.08;

    // bigger near center-ish, smaller toward edge, with noise
    const puffR =
      lerp(radius * 0.22, radius * 0.06, smoothstep(0.0, 1.0, rNorm)) *
      lerp(0.75, 1.25, rnd());

    const contrast = lerp(0.75, 1.45, vividness);
    const a =
      lerp(0.018, 0.055, 1 - rNorm) *
      alpha *
      contrast *
      lerp(0.7, 1.2, rnd());

    const h = hue + (rnd() - 0.5) * hueSpread;
    const s = lerp(55, 30, rNorm) * lerp(0.9, 1.1, rnd());
    const l = lerp(12, 28, rnd()); // bright/dark pockets

    g.fillStyle(hslColor(h, s, l), a);
    g.fillCircle(x, y, puffR);

    // inner bright pocket sometimes
    if (rnd() < lerp(0.25, 0.45, vividness)) {
      const innerR = puffR * lerp(0.35, 0.65, rnd());
      const innerA = a * lerp(0.35, 0.75, rnd());

      const hh = h + lerp(-10, 10, rnd());
      const ss = lerp(40, 60, rnd());
      const ll = lerp(35, 55, rnd());

      g.fillStyle(hslColor(hh, ss, ll), innerA);
      g.fillCircle(x + (rnd() - 0.5) * innerR * 0.6, y + (rnd() - 0.5) * innerR * 0.6, innerR);
    }
  }

  // 3. Fine details (lots of smaller puffs)
  for (let i = 0; i < detailCount; i++) {
    const p = sampleDiskBiased(rnd, 1.7);
    const rNorm = p.r;

    const x = p.x * radius * 1.02 + (rnd() - 0.5) * radius * 0.06;
    const y = p.y * radius * 1.02 + (rnd() - 0.5) * radius * 0.06;

    const detailR = lerp(radius * 0.06, radius * 0.012, rNorm) * lerp(0.8, 1.4, rnd());
    const a =
      lerp(0.008, 0.028, 1 - rNorm) *
      alpha *
      lerp(0.9, 1.3, vividness) *
      lerp(0.7, 1.25, rnd());

    const h = hue + (rnd() - 0.5) * (hueSpread * 0.8);
    const s = lerp(60, 35, rNorm);
    const l = lerp(10, 26, rnd());

    g.fillStyle(hslColor(h, s, l), a);
    g.fillCircle(x, y, detailR);
  }

  // 4. Dark dust lanes / cavities
  for (let i = 0; i < dustCount; i++) {
    const p = sampleDiskBiased(rnd, 1.25);
    const rNorm = p.r;

    const x = p.x * radius * 0.92 + (rnd() - 0.5) * radius * 0.1;
    const y = p.y * radius * 0.92 + (rnd() - 0.5) * radius * 0.1;

    const dustR = lerp(radius * 0.18, radius * 0.04, rNorm) * lerp(0.8, 1.3, rnd());

    // stronger dust where vividness is higher
    const a = lerp(0.015, 0.06, vividness) * lerp(0.35, 0.85, rnd()) * alpha;

    // not pure black; slightly tinted looks nicer
    const tint = Phaser.Display.Color.HSLToColor((hue / 360), 0.25, 0.04).color;
    g.fillStyle(tint, a);
    g.fillCircle(x, y, dustR);

    // sometimes add a sharper “bite”
    if (rnd() < 0.35) {
      g.fillStyle(0x000000, a * 0.55);
      g.fillCircle(x + (rnd() - 0.5) * dustR * 0.35, y + (rnd() - 0.5) * dustR * 0.35, dustR * 0.6);
    }
  }

  // 5, Glowing edges
  if (glowEdges) {
    g.setBlendMode(Phaser.BlendModes.ADD);

    // Pick a few noisy arcs and stamp bright puffs along them
    const arcCount = Math.floor(lerp(2, 4, vividness));
    for (let arc = 0; arc < arcCount; arc++) {
      const baseAngle = rnd() * Math.PI * 2;
      const arcSpan = lerp(Math.PI * 0.55, Math.PI * 1.15, rnd()); // partial arcs
      const steps = Math.floor(rimCount / arcCount);

      // Rim radius varies slightly per arc
      const rimR = radius * lerp(0.55, 0.95, rnd());

      for (let i = 0; i < steps; i++) {
        const t = i / Math.max(1, steps - 1);

        // angle with noise to make it "ragged"
        const ang = baseAngle + (t - 0.5) * arcSpan + (rnd() - 0.5) * 0.22;

        // radius with noise to move in/out and create edge glow pockets
        const rr = rimR * (1 + (rnd() - 0.5) * 0.18);

        const x = Math.cos(ang) * rr;
        const y = Math.sin(ang) * rr;

        const glowR = lerp(radius * 0.05, radius * 0.018, rnd()) * lerp(0.9, 1.35, vividness);
        const a = lerp(0.02, 0.085, vividness) * lerp(0.5, 1.0, rnd()) * alpha;

        // Edges should be lighter/whiter; keep pastel hue but raise lightness
        const h = hue + (rnd() - 0.5) * (hueSpread * 0.7);
        const s = lerp(25, 55, rnd());
        const l = lerp(55, 82, rnd());

        const col = hslColor(h, s, l);
        g.fillStyle(col, a);
        g.fillCircle(x, y, glowR);

        // tiny hot kernel
        if (rnd() < 0.35) {
          g.fillStyle(hslColor(h, s * 0.4, 92), a * 0.45);
          g.fillCircle(x + (rnd() - 0.5) * glowR * 0.5, y + (rnd() - 0.5) * glowR * 0.5, glowR * 0.4);
        }
      }
    }

    g.setBlendMode(Phaser.BlendModes.NORMAL);
  }

  // 6. Small bright knots
  // Not stars; just tiny luminous pockets
  g.setBlendMode(Phaser.BlendModes.ADD);
  const knotCount = Math.floor(lerp(10, 26, vividness));
  for (let i = 0; i < knotCount; i++) {
    const p = sampleDiskBiased(rnd, 1.6);
    const rNorm = p.r;

    const x = p.x * radius * 0.9;
    const y = p.y * radius * 0.9;

    const knotR = lerp(radius * 0.02, radius * 0.006, rNorm) * lerp(0.8, 1.4, rnd());
    const a = lerp(0.03, 0.12, vividness) * lerp(0.4, 1.0, rnd()) * alpha;

    const h = hue + (rnd() - 0.5) * hueSpread;
    const col = hslColor(h, 35, lerp(70, 92, rnd()));
    g.fillStyle(col, a);
    g.fillCircle(x, y, knotR);

    g.fillStyle(0xffffff, a * 0.25);
    g.fillCircle(x, y, knotR * 0.35);
  }
  g.setBlendMode(Phaser.BlendModes.NORMAL);

};