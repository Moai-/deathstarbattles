import { clamp01, lerp, smoothstep, sampleDiskBiased, makeLCG, stampFeathered } from "src/render/utils";

export type GalaxyOptions = {
  x: number;
  y: number;

  outerRadius?: number; // px
  coreRadius?: number;  // px

  // 0 = face-on, 1 = edge-on
  tilt?: number;

  // radians; if omitted, randomized
  rotation?: number;

  // Base look
  hue?: number; // 0..360
  gasAlpha?: number; // overall transparency multiplier

  // Detail
  spotCount?: number;
  seed?: number;            // For repeatable patterns
  armCount?: number;        // number of spiral arms
  armStrength?: number;     // 0..1 how visible arms are
  armTwist?: number;        // radians of twist across radius
  armJitter?: number;       // 0..1 random wobble
};

export const drawGalaxy = (g: Phaser.GameObjects.Graphics, opts: GalaxyOptions) => {
  const centerX = opts.x;
  const centerY = opts.y;

  const outerRadius = opts.outerRadius ?? Phaser.Math.FloatBetween(220, 520);
  const coreRadius = opts.coreRadius ?? outerRadius * Phaser.Math.FloatBetween(0.03, 0.09);

  const tilt = clamp01(opts.tilt ?? Math.random());
  const rotation = opts.rotation ?? (Math.random() * Math.PI * 2);

  const axisRatio = lerp(1.0, 0.15, tilt);

  const hue = opts.hue ?? Phaser.Math.Between(190, 320); // bluish -> purple-ish default
  const gasAlpha = opts.gasAlpha ?? 1;

  const localRnd =
    opts.seed == null ? Math.random : makeLCG(opts.seed);

  g.setPosition(centerX, centerY);
  g.setRotation(rotation);
  g.setScale(1, axisRatio);

  // 1. Diffuse gas body: many layered circles with falloff
  const rings = 110; // increase for smoother gradients (costs more fill ops)
  for (let i = 0; i < rings; i++) {
    const t = i / (rings - 1);         // 0..1 outward
    const inv = 1 - t;

    // Nonlinear radius spacing and alpha falloff
    const r = lerp(coreRadius * 0.6, outerRadius, Math.pow(t, 1.25));
    const a = Math.pow(inv, 2.2) * 0.055 * gasAlpha; // keep subtle

    // Color: brighter/warmer near core, cooler near edge
    const h = (hue + lerp(-10, 15, t) + (localRnd() - 0.5) * 6) % 360;
    const s = lerp(65, 45, t);          // slightly desaturate outward
    const l = lerp(22, 10, t);          // darker outward

    const color = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;
    g.fillStyle(color, a);
    g.fillCircle(0, 0, r);
  }

  // 2. Brighter core: tighter rings, higher alpha
  const coreRings = 45;
  for (let i = 0; i < coreRings; i++) {
    const t = i / (coreRings - 1);
    const inv = 1 - t;

    const r = lerp(coreRadius * 1.1, coreRadius * 0.15, t);
    const a = Math.pow(inv, 1.5) * 0.22 * gasAlpha;

    // Core tends towards warm/white-ish highlights
    const h = (hue + lerp(-20, 10, t)) % 360;
    const s = lerp(55, 20, t);
    const l = lerp(30, 55, t);

    const color = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;
    g.fillStyle(color, a);
    g.fillCircle(0, 0, r);
  }

  // 2.5. Spiral arms (diffuse ribbons made of soft clumps)
  const armCount = opts.armCount ?? Phaser.Math.Between(2, 5);
  const armStrength = clamp01(opts.armStrength ?? Phaser.Math.FloatBetween(0.35, 0.85));
  const armTwist = opts.armTwist ?? Phaser.Math.FloatBetween(7.0, 12.0); // radians across radius
  const armJitter = clamp01(opts.armJitter ?? 0.35);

  // How far arms start (avoid painting arms right in the core)
  const armStart = coreRadius * 0.9;
  const armEnd = outerRadius * 0.98;

  // Total clumps per arm: more = smoother, slower
  const clumpsPerArm = Math.floor(lerp(55, 110, armStrength));

  // Optional "arm haze" underneath clumps to make arms read as continuous
  const hazePasses = 2;

  // Base phase so arms aren't always aligned the same way
  const baseArmPhase = localRnd() * Math.PI * 2;

  // A gentle fade so arms are strongest mid-radius
  const armRadialWeight = (rNorm: number) => {
    // rNorm: 0..1 along arm span
    // fade in quickly, peak mid, fade out near edge
    const inW = smoothstep(0.05, 0.22, rNorm);
    const outW = 1 - smoothstep(0.78, 1.0, rNorm);
    return inW * outW;
  };

  // Haze: broader, very low alpha
  for (let pass = 0; pass < hazePasses; pass++) {
    const hazeScale = pass === 0 ? 1.15 : 0.95; // two slightly different sizes
    const hazeAlphaMul = pass === 0 ? 0.55 : 0.35;

    for (let arm = 0; arm < armCount; arm++) {
      const armOffset = baseArmPhase + (arm * (Math.PI * 2)) / armCount;

      for (let i = 0; i < clumpsPerArm; i++) {
        const t = i / (clumpsPerArm - 1); // 0..1
        const r = lerp(armStart, armEnd, Math.pow(t, 0.92));

        // Spiral angle: twist grows with radius
        const spiral = armOffset + armTwist * Math.pow(t, 1.05);

        // Jitter/wobble increases outward a bit
        const jitterMag = armJitter * outerRadius * 0.03 * (0.25 + 0.75 * t);
        const jx = (localRnd() - 0.5) * jitterMag;
        const jy = (localRnd() - 0.5) * jitterMag;

        // Position on spiral
        const x = Math.cos(spiral) * r + jx;
        const y = Math.sin(spiral) * r + jy;

        // Size and alpha
        const w = armRadialWeight(t);
        if (w <= 0.001) continue;

        const clumpR = lerp(outerRadius * 0.06, outerRadius * 0.022, t) * hazeScale;
        const a = w * 0.035 * armStrength * gasAlpha * hazeAlphaMul;

        // Slightly different hue for arms so they "pop" from the blob
        const h = (hue + lerp(-18, 22, t) + (localRnd() - 0.5) * 10) % 360;
        const s = lerp(55, 45, t);
        const l = lerp(18, 12, t);

        const color = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;
        g.fillStyle(color, a);
        g.fillCircle(x, y, clumpR);
      }
    }
  }

  // Clumps: tighter, brighter highlights along arms
  const spacingK = 0.2;
  for (let arm = 0; arm < armCount; arm++) {
    const armOffset = baseArmPhase + (arm * (Math.PI * 2)) / armCount;

    let t = 0;
    while (t < 1) {
      const r = lerp(armStart, armEnd, Math.pow(t, 0.9));
      const spiral = armOffset + armTwist * Math.pow(t, 1.06);

      const jitterMag = armJitter * outerRadius * 0.02 * (0.2 + 0.8 * t);
      const jx = (localRnd() - 0.5) * jitterMag;
      const jy = (localRnd() - 0.5) * jitterMag;

      const x = Math.cos(spiral) * r + jx;
      const y = Math.sin(spiral) * r + jy;

      const w = armRadialWeight(t);
      if (w > 0.001) {
        const clumpR = lerp(outerRadius * 0.035, outerRadius * 0.012, t) * lerp(1.2, 0.85, armStrength);
        const a = w * 0.11 * armStrength * gasAlpha;

        const h = (hue + lerp(-10, 26, t) + (localRnd() - 0.5) * 12) % 360;
        const s = lerp(78, 60, t);
        const l = lerp(34, 18, t);
        const color = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;

        stampFeathered(g, x, y, clumpR, color, a, 6);
        if (localRnd() < lerp(0.10, 0.03, t)) {
          const hi = Phaser.Display.Color.HSLToColor(h / 360, (s * 0.4) / 100, 0.9).color;
          g.setBlendMode(Phaser.BlendModes.ADD);
          stampFeathered(g, x, y, clumpR * 0.55, hi, a * 0.35, 5);
          g.setBlendMode(Phaser.BlendModes.NORMAL);
        }

        const step = (clumpR * spacingK) / outerRadius;
        t += Phaser.Math.Clamp(step, 0.008, 0.03);
        continue;
      }

      // If w is tiny, still advance a bit
      t += 0.02;
    }
  }

  // 3. Bright spots: star-forming regions / clumps
  const spotCount = opts.spotCount ?? Math.floor(lerp(10, 35, 1 - tilt));
  for (let i = 0; i < spotCount; i++) {
    const p = sampleDiskBiased(localRnd, 2.6);
    // spread spots within about 85% of outer radius
    const x = p.x * outerRadius * 0.85;
    const y = p.y * outerRadius * 0.85;

    const spotR = lerp(3, 18, Math.pow(localRnd(), 2.0));
    const a = lerp(0.06, 0.18, localRnd()) * gasAlpha;

    const h = (hue + lerp(-35, 35, localRnd())) % 360;
    const s = lerp(45, 75, localRnd());
    const l = lerp(35, 60, localRnd());

    const color = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;
    g.fillStyle(color, a);
    g.fillCircle(x, y, spotR);

    // Optional micro-highlight inside the clump
    if (localRnd() < 0.35) {
      const hi = Phaser.Display.Color.HSLToColor(
        ((h + 10) % 360) / 360,
        (s * 0.6) / 100,
        0.75,
      ).color;
      g.fillStyle(hi, a * 0.6);
      g.fillCircle(x + (localRnd() - 0.5) * 6, y + (localRnd() - 0.5) * 6, spotR * 0.35);
    }
  }

  // 4. Dust lane - stronger when tilted (edge-ish)
  // This gives a "side-on" vibe and breaks up the smooth glow
  if (tilt > 0.35) {
    const laneCount = Math.floor(lerp(0, 3, (tilt - 0.35) / 0.65));
    for (let i = 0; i < laneCount; i++) {
      const laneOffset = (localRnd() - 0.5) * outerRadius * 0.18;
      const laneR = lerp(outerRadius * 0.45, outerRadius * 0.9, localRnd());
      const laneThickness = lerp(10, 38, localRnd()); // becomes an ellipse due to scaleY
      const laneAlpha = lerp(0.05, 0.14, tilt) * gasAlpha;

      g.fillStyle(0x000000, laneAlpha);
      g.fillCircle(0, laneOffset, laneR);
      g.fillStyle(0x000000, laneAlpha * 1.2);
      g.fillCircle(0, laneOffset, Math.max(0, laneR - laneThickness));
    }
  }
}