import { clamp01, lerp, makeLCG, smoothstep } from "src/render/utils";

export type DustLaneOptions = {
  x: number;
  y: number;

  // Overall footprint
  length?: number;          // px
  thickness?: number;       // px (base lane width)
  rotation?: number;        // radians
  curvature?: number;       // -1..1 (bend amount)

  // Look
  alpha?: number;           // overall opacity multiplier (0.6..1.2 typical)
  warmth?: number;          // 0..1 tint dust slightly warm instead of pure black
  contrast?: number;        // 0..1 stronger dark cores + brighter rims
  glowEdge?: boolean;       // faint glow along one side

  // Structure
  laneCount?: number;       // number of separate lanes
  segments?: number;        // curve resolution
  filamentCount?: number;   // thin strands per lane
  clumpCount?: number;      // dark pockets per lane
  jitter?: number;          // 0..1

  seed?: number;
};

const dustTint = (warmth: number) => {
  const w = clamp01(warmth);
  const warm = Phaser.Display.Color.HSLToColor(35 / 360, 0.35, 0.06).color;  // brown-black
  const cool = Phaser.Display.Color.HSLToColor(220 / 360, 0.25, 0.05).color; // blue-black
  const wc = Phaser.Display.Color.IntegerToRGB(warm);
  const cc = Phaser.Display.Color.IntegerToRGB(cool);
  const r = Math.round(lerp(cc.r, wc.r, w));
  const g = Math.round(lerp(cc.g, wc.g, w));
  const b = Math.round(lerp(cc.b, wc.b, w));
  return Phaser.Display.Color.GetColor(r, g, b);
};

export const drawDustLanes = (g: Phaser.GameObjects.Graphics, opts: DustLaneOptions) => {
  const rnd =
    opts.seed == null ? Math.random : makeLCG(opts.seed);

  const length = opts.length ?? Phaser.Math.FloatBetween(480, 1100);
  const thickness = opts.thickness ?? Phaser.Math.FloatBetween(70, 160);

  const rotation = opts.rotation ?? (rnd() * Math.PI * 2);
  const curvature = Phaser.Math.Clamp(opts.curvature ?? lerp(-0.55, 0.55, rnd()), -1, 1);

  const alphaMul = opts.alpha ?? 1;
  const warmth = opts.warmth ?? 0.35;
  const contrast = clamp01(opts.contrast ?? 0.7);
  const glowEdge = opts.glowEdge ?? true;

  const laneCount = opts.laneCount ?? Math.floor(lerp(1, 3, rnd()));
  const segments = opts.segments ?? Math.floor(lerp(18, 34, rnd()));
  const filamentCount = opts.filamentCount ?? Math.floor(lerp(6, 14, contrast));
  const clumpCount = opts.clumpCount ?? Math.floor(lerp(10, 22, contrast));
  const jitter = clamp01(opts.jitter ?? 0.55);

  g.setPosition(opts.x, opts.y);
  g.setRotation(rotation);
  g.setScale(1, 1);

  const dustColor = dustTint(warmth);

  // Lane centerlines are defined in local space along X, with Y offset and curvature.
  const x0 = -length / 2;
  const x1 = length / 2;

  const centerlineY = (t: number, laneOffset: number) => {
    // curvature creates a broad "S" curve; add a little waviness too
    const bend = curvature * (t - 0.5);
    const sCurve = Math.sin((t - 0.5) * Math.PI) * bend * thickness * 0.9;

    const waveA = (0.25 + 0.75 * jitter) * thickness * 0.12;
    const wave = Math.sin(t * Math.PI * 2 * lerp(1.0, 2.8, rnd()) + rnd() * 6.28) * waveA;

    return laneOffset + sCurve + wave;
  };

  // Draw multiple lanes
  for (let lane = 0; lane < laneCount; lane++) {
    const laneOffset = (rnd() - 0.5) * thickness * 1.1;

    // Body width varies per lane
    const laneWidth = thickness * lerp(0.75, 1.2, rnd());

    // 1. Wide soft body: stamp circles along the curve
    // We do 2 passes: wide soft + inner darker core.
    const bodySteps = segments * 2;

    for (let pass = 0; pass < 2; pass++) {
      const core = pass === 1;
      const stepCount = core ? bodySteps : bodySteps;

      for (let i = 0; i < stepCount; i++) {
        const t = i / (stepCount - 1);
        const x = lerp(x0, x1, t);

        const y = centerlineY(t, laneOffset);

        // width tapers toward ends
        const endFade = smoothstep(0.0, 0.1, t) * (1 - smoothstep(0.9, 1.0, t));

        const wobble = (rnd() - 0.5) * laneWidth * 0.06 * jitter;
        const ww = laneWidth * lerp(0.9, 1.1, rnd()) * endFade;

        const r = (core ? ww * 0.22 : ww * 0.42) * lerp(0.85, 1.15, rnd());
        const aBase = core
          ? lerp(0.045, 0.11, contrast)
          : lerp(0.02, 0.055, contrast);

        const a = aBase * alphaMul * endFade;

        // core is darker (slightly more black), body is tinted dust
        g.fillStyle(core ? 0x000000 : dustColor, a);
        g.fillCircle(x, y + wobble, r);
      }
    }

    // 2. Filaments: thin strands inside the lane
    for (let f = 0; f < filamentCount; f++) {
      const offset = (rnd() - 0.5) * laneWidth * 0.22;
      const phase = rnd() * 6.28;
      const freq = lerp(2.0, 5.0, rnd());
      const amp = laneWidth * lerp(0.02, 0.09, rnd()) * (0.3 + 0.7 * jitter);

      const lineA = lerp(0.02, 0.06, contrast) * alphaMul * lerp(0.6, 1.2, rnd());
      const lineW = lerp(1.0, 2.6, rnd()) * (1 + contrast);

      g.lineStyle(lineW, 0x000000, lineA);
      g.beginPath();

      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1);
        const x = lerp(x0, x1, t);

        const y0c = centerlineY(t, laneOffset);
        const wiggle = Math.sin(t * Math.PI * freq + phase) * amp;
        const y = y0c + offset + wiggle;

        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }

      g.strokePath();
    }

    // 3. Clumpy occluders: pockets / knots of darkness
    for (let c = 0; c < clumpCount; c++) {
      const t = rnd();
      const x = lerp(x0, x1, t);

      const y = centerlineY(t, laneOffset) + (rnd() - 0.5) * laneWidth * 0.28;

      const endFade = smoothstep(0.02, 0.12, t) * (1 - smoothstep(0.88, 0.98, t));
      const r = laneWidth * lerp(0.06, 0.18, rnd()) * endFade;
      const a = lerp(0.03, 0.12, contrast) * alphaMul * endFade;

      g.fillStyle(0x000000, a);
      g.fillCircle(x, y, r);

      // sometimes soften edges with a larger tinted halo
      if (rnd() < 0.45) {
        g.fillStyle(dustColor, a * 0.35);
        g.fillCircle(x + (rnd() - 0.5) * r * 0.6, y + (rnd() - 0.5) * r * 0.6, r * 1.35);
      }
    }

    // 4. Rim glow
    if (glowEdge) {
      g.setBlendMode(Phaser.BlendModes.ADD);

      const side = rnd() < 0.5 ? -1 : 1; // which side glows
      const glowSteps = segments;

      for (let i = 0; i < glowSteps; i++) {
        const t = i / (glowSteps - 1);
        const x = lerp(x0, x1, t);
        const y = centerlineY(t, laneOffset);

        const endFade = smoothstep(0.0, 0.12, t) * (1 - smoothstep(0.88, 1.0, t));
        const rr = laneWidth * lerp(0.018, 0.05, rnd()) * endFade;

        const offset = side * laneWidth * lerp(0.24, 0.36, rnd());
        const a = lerp(0.006, 0.02, contrast) * alphaMul * endFade;

        // warm-ish pale glow (works on nebula); keep subtle
        g.fillStyle(0xffffff, a * 0.18);
        g.fillCircle(x, y + offset, rr);

        g.fillStyle(Phaser.Display.Color.HSLToColor(35 / 360, 0.25, 0.65).color, a * 0.35);
        g.fillCircle(x + (rnd() - 0.5) * rr, y + offset + (rnd() - 0.5) * rr, rr * 0.8);
      }

      g.setBlendMode(Phaser.BlendModes.NORMAL);
    }
  }

};