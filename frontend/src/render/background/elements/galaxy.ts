import { clamp01, lerp, smoothstep, sampleDiskBiased, makeLCG, stampFeathered } from "src/render/utils";

export type GalaxyOptions = {
  outerRadius: number; // full-disk radius, px
  
  x: number; // On-screen location
  y: number;
  
  // 0 = face-on, 1 = edge-on
  tilt?: number;
  
  // radians; if omitted, randomized
  rotation?: number;
  
  // Base look
  hue?: number;        // 0..360
  saturation?: number; // 0..100 (multiplier on computed saturation)
  lightness?: number;  // 0..100 (multiplier on computed lightness)
  gasAlpha?: number;   // overall transparency multiplier
  
  // Detail
  spotCount?: number;
  armCount?: number;        // number of spiral arms
  armStrength?: number;     // 0..1 how visible arms are
  armTwist?: number;        // radians of twist across radius
  armJitter?: number;       // 0..1 random wobble
  
  // Core props
  coreRadius?: number;  // Inner core radius, px
  coreFuzz?: number;   // 0..1 (0 = crisp rings, 1 = very soft/fuzzy)
  coreBulge?: number;  // 0..1 (0 = core matches disk tilt, 1 = core much rounder)
  coreAlpha?: number;  // optional overall core intensity multiplier
  coreNucleus?: number; // 0..1, how strong the bright center is

  seed?: number;            // For repeatable patterns
};

// Galaxy with light core, spiral arms, etc
export const drawGalaxy = (g: Phaser.GameObjects.Graphics, opts: GalaxyOptions) => {
  const centerX = opts.x;
  const centerY = opts.y;

  const outerRadius = opts.outerRadius ?? Phaser.Math.FloatBetween(220, 520);
  const coreRadius = opts.coreRadius ?? outerRadius * Phaser.Math.FloatBetween(0.03, 0.09);

  const tilt = clamp01(opts.tilt ?? Math.random());
  const rotation = opts.rotation ?? (Math.random() * Math.PI * 2);

  const axisRatio = lerp(1.0, 0.15, tilt);

  const hue = opts.hue ?? Phaser.Math.Between(190, 320); // bluish -> purple-ish default
  const satMul = (opts.saturation ?? 100) / 100;
  const lightMul = (opts.lightness ?? 100) / 100;
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
    const s = Phaser.Math.Clamp(lerp(65, 45, t) * satMul, 0, 100);
    const l = Phaser.Math.Clamp(lerp(22, 10, t) * lightMul, 0, 100);

    const color = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;
    g.fillStyle(color, a);
    g.fillCircle(0, 0, r);
  }

  // 2. Brighter core: tighter rings, higher alpha
  const coreFuzz = clamp01(opts.coreFuzz ?? 0.70);
  const coreBulge = clamp01(opts.coreBulge ?? 0.85);
  const coreAlphaMul = opts.coreAlpha ?? 1;

  // Disk squash (already applied to the whole galaxy)
  // axisRatio = lerp(1.0, 0.15, tilt);

  // Stronger bulge target: at high tilt, keep the core much rounder than the disk
  // "walnut" vibe: disk can go to ~0.15, but core should hang around ~0.55-ish
  const tiltW = smoothstep(0.35, 1.0, tilt);

  // Make the core rounder at high tilt
  const bulgeTarget = lerp(1.0, 0.78, tilt); 
  const coreAxisRatio = Phaser.Math.Clamp(
    lerp(axisRatio, bulgeTarget, coreBulge * tiltW),
    axisRatio,
    1.0,
  );
  
  // Walnut shaping: inflate Y near the center along X so it’s thick in the middle
  const walnut = clamp01(lerp(0.0, 0.95, coreBulge) * tiltW); // only when tilted
  const walnutSpan = coreRadius * 1.6; // how far along X before it tapers
  
  const applyWalnut = (x: number, y: number) => {
    if (walnut <= 0.0001) return { x, y };
  
    const ax = Math.abs(x) / walnutSpan;              // 0..~
    const mid = 1 - smoothstep(0.15, 1.0, ax);        // 1 in center, ->0 at ends
    const bulge = 1 + walnut * mid * mid;             // quadratic for a nice “peanut/walnut”
    return { x, y: y * bulge };
  };

  // Temporarily apply core-only scaleY so it resists squish
  const prevScaleX = g.scaleX;
  const prevScaleY = g.scaleY;
  g.setScale(prevScaleX, coreAxisRatio);

  // Core sizes
  const coreOuter = coreRadius * lerp(2.3, 1.7, 1 - coreFuzz); // bigger + softer when fuzzier
  const nucleusR = coreRadius * lerp(0.55, 0.35, coreFuzz);    // tighter nucleus when fuzzier
  const coreNucleus = clamp01(opts.coreNucleus ?? 0.75);


  // Puff counts (keep these reasonable for perf)
  const hazePuffs = Math.floor(lerp(90, 170, coreFuzz));       // outer blending haze
  const bulgePuffs = Math.floor(lerp(160, 320, coreFuzz));     // main bulge body
  const nucleusPuffs = Math.floor(lerp(120, 260, coreFuzz) * lerp(0.7, 1.35, coreNucleus));// inner brightening

  // Feathering
  const hazeFeather = Math.floor(lerp(6, 12, coreFuzz));
  const bulgeFeather = Math.floor(lerp(5, 11, coreFuzz));

  // Helper: radial mapping (0 center -> 1 edge)
  const coreRadNorm = (r: number) => Phaser.Math.Clamp(r / coreOuter, 0, 1);

  // ---- (A) Outer haze: makes the core boundary "liquid/gassy" into the disk
  for (let i = 0; i < hazePuffs; i++) {
    // Bias toward the edge so it blends, not brighten the center too much
    const t = Math.pow(localRnd(), 0.55); // 0..1, biased toward 1
    const r = lerp(coreRadius * 0.9, coreOuter, t);

    const ang = localRnd() * Math.PI * 2;
    const {x, y} = applyWalnut(Math.cos(ang) * r, Math.sin(ang) * r)

    const rn = coreRadNorm(r);           // 0..1
    const edge = smoothstep(0.35, 1.0, rn);

    // Slightly brighter near the core edge, but low alpha overall
    const h = (hue + lerp(-10, 16, rn) + (localRnd() - 0.5) * 10) % 360;
    const s = Phaser.Math.Clamp(lerp(50, 35, rn) * satMul, 0, 100);
    const l = Phaser.Math.Clamp(lerp(18, 14, rn) * lightMul, 0, 100);

    const col = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;

    const puffR = lerp(coreRadius * 0.42, coreRadius * 0.75, localRnd()) * lerp(1.25, 1.6, edge);
    const a = gasAlpha * coreAlphaMul * lerp(0.010, 0.026, edge) * lerp(1.15, 0.75, coreFuzz);

    stampFeathered(g, x, y, puffR, col, a, hazeFeather);
  }

  // ---- (B) Bulge body: turbulent puffs that get whiter + brighter toward center
  for (let i = 0; i < bulgePuffs; i++) {
    // Bias distribution inward (more mass near center)
    const t = Math.pow(localRnd(), lerp(1.8, 2.6, coreFuzz)); // higher fuzz => stronger inner bias
    const r = lerp(coreOuter, 0, t);

    const ang = localRnd() * Math.PI * 2;

    // Turbulence/jitter similar “feel” to your accretion disk
    const turb = lerp(0.35, 1.0, coreFuzz);
    const jitter = turb * coreRadius * 0.22 * (0.25 + 0.75 * (1 - t));

    const {x, y} = applyWalnut(
      Math.cos(ang) * r + (localRnd() - 0.5) * jitter,
      Math.sin(ang) * r + (localRnd() - 0.5) * jitter
    );

    const rn = coreRadNorm(r);
    const center = 1 - rn;

    // Whitening ramps up smoothly as you approach the center
    const whiten = smoothstep(0.25, 0.95, center);

    // Lower saturation + higher lightness toward center (fixes “bright ring + dark center”)
    const h = (hue + lerp(-6, 10, rn) + (localRnd() - 0.5) * lerp(10, 3, whiten)) % 360;
    const s = Phaser.Math.Clamp(lerp(52, 6, whiten) * satMul, 0, 100);   // -> nearly white at center
    const l = Phaser.Math.Clamp(lerp(20, 62, whiten) * lightMul, 0, 100); // -> brighter at center (but not blown out)

    const col = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;

    // Puff size: larger in the mid/outer bulge, smaller near nucleus
    const puffR =
      lerp(coreRadius * 0.55, coreRadius * 0.14, whiten) *
      lerp(1.25, 1.65, coreFuzz);

    // Alpha: strongest toward center, but *soft*; no hard boundary
    const a =
      gasAlpha *
      coreAlphaMul *
      lerp(0.010, 0.040, smoothstep(0.10, 0.95, center)) *
      lerp(1.10, 0.80, coreFuzz);

    stampFeathered(g, x, y, puffR, col, a, bulgeFeather);
  }

  // ---- (C) Nucleus: a small additive-ish inner glow (subtle, no ring)

  g.setBlendMode(Phaser.BlendModes.ADD);
  
  for (let i = 0; i < nucleusPuffs; i++) {
    const t = Math.pow(localRnd(), 2.6);            // heavily center-biased
    const r = lerp(nucleusR, 0, t);
    const ang = localRnd() * Math.PI * 2;
  
    let x = Math.cos(ang) * r + (localRnd() - 0.5) * coreRadius * 0.07;
    let y = Math.sin(ang) * r + (localRnd() - 0.5) * coreRadius * 0.07;
  
    const p = applyWalnut(x, y);
    x = p.x; y = p.y;
  
    // Monotonic whitening + brightening toward center
    const center = 1 - (r / nucleusR);             // 0 edge -> 1 center
    const whiten = smoothstep(0.10, 1.0, center);
  
    const h = (hue + (localRnd() - 0.5) * lerp(6, 1, whiten)) % 360;
    const s = Phaser.Math.Clamp(lerp(18, 2, whiten) * satMul, 0, 100);
    const l = Phaser.Math.Clamp(lerp(70, 96, whiten) * lightMul, 0, 100);

    const col = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100).color;
  
    const puffR = lerp(coreRadius * 0.22, coreRadius * 0.09, t) * lerp(1.1, 1.35, coreFuzz);
    const a = gasAlpha * coreAlphaMul * lerp(0.020, 0.060, whiten) * lerp(0.65, 1.15, coreNucleus);
  
    stampFeathered(g, x, y, puffR, col, a, Math.floor(lerp(6, 12, coreFuzz)));
  }
  
  g.setBlendMode(Phaser.BlendModes.NORMAL);

  // Restore disk scale for arms/spots/dust
  g.setScale(prevScaleX, prevScaleY);


  // ---- (D) Simple white nuclear sphere (transparent edge -> solid center)
  {
    // Radius relative to coreRadius
    const sphereR = coreRadius * 0.3;

    // Alpha at the center; keep modest so it doesn't blow out
    const sphereAlpha = (opts.coreAlpha ?? 1) * gasAlpha * 0.6;

    // Feather steps controls how smooth the gradient is
    const sphereFeather = Math.floor(lerp(8, 16, coreFuzz));

    // Pure white, radial alpha falloff handled by stampFeathered
    stampFeathered(g, 0, 0, sphereR, 0xffffff, sphereAlpha, sphereFeather);

    // Optional: a tiny additive pop to make it feel "hot" without hard edges
    g.setBlendMode(Phaser.BlendModes.ADD);
    stampFeathered(g, 0, 0, sphereR * 0.55, 0xffffff, sphereAlpha * 0.55, Math.max(6, sphereFeather - 2));
    g.setBlendMode(Phaser.BlendModes.NORMAL);
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
        const a = w * 0.3 * armStrength * gasAlpha * hazeAlphaMul;

        // Slightly different hue for arms so they "pop" from the blob
        const h = (hue + lerp(-18, 22, t) + (localRnd() - 0.5) * 10) % 360;
        const s = Phaser.Math.Clamp(lerp(55, 45, t) * satMul, 0, 100);
        const l = Phaser.Math.Clamp(lerp(18, 12, t) * lightMul, 0, 100);

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
        const s = Phaser.Math.Clamp(lerp(78, 60, t) * satMul, 0, 100);
        const l = Phaser.Math.Clamp(lerp(34, 18, t) * lightMul, 0, 100);
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
    const s = Phaser.Math.Clamp(lerp(45, 75, localRnd()) * satMul, 0, 100);
    const l = Phaser.Math.Clamp(lerp(35, 60, localRnd()) * lightMul, 0, 100);

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

// Galaxy bulge
export type BulgeKnobs = {
  bulgeStrength?: number; // 0..1
  zStrength?: number;     // 0..1
  tiltStart?: number;     // when effect starts showing up (default ~0.35)
  tiltFull?: number;      // when effect reaches full (default ~0.85)
};

export const computeBulgeFromTilt = (tilt: number, knobs: BulgeKnobs = {}) => {
  const bulgeStrength = clamp01(knobs.bulgeStrength ?? 1);
  const zStrength = clamp01(knobs.zStrength ?? 1);

  const tiltStart = knobs.tiltStart ?? 0.35;
  const tiltFull = knobs.tiltFull ?? 0.85;

  const t = smoothstep(tiltStart, tiltFull, tilt);

  // Sphere A - disk bulge
  const aSX = lerp(1.0, 1.4, t * bulgeStrength);
  const aSY = lerp(1.0, 0.7, t * bulgeStrength);

  // Sphere B - z-bulge
  const bBase = lerp(0.55, 0.70, zStrength);

  const tZ = smoothstep(0.55, 1.0, t);
  const bSX2 = lerp(bBase, 0.9, tZ * zStrength);
  const bSY2 = lerp(bBase, 1.2, tZ * zStrength);

  return {
    t,
    sphereA: { sx: aSX, sy: aSY },
    sphereB: { sx: bSX2, sy: bSY2 },
  };
};

export type GalaxyCompositeOptions = Omit<GalaxyOptions & BulgeKnobs, 'x' | 'y'>;

// Both together
export const drawGalaxyComposite = (scene: Phaser.Scene, opts: GalaxyCompositeOptions) => {
  const outerRadius = opts.outerRadius ?? Phaser.Math.FloatBetween(220, 520);
  const rotation = opts.rotation ?? (Math.random() * Math.PI * 2);
  const coreRadius = opts.coreRadius ?? outerRadius * Phaser.Math.FloatBetween(0.03, 0.09);
  const bulgeStrength = opts.bulgeStrength ?? 1
  const tilt = clamp01(opts.tilt ?? Math.random());

  const pad = outerRadius * 0.35;
  const size = Math.ceil((outerRadius + pad) * 2);
  const cx = size / 2;
  const cy = size / 2;

  const renderTexture = scene.make.renderTexture({ width: size, height: size }).setVisible(false);
  renderTexture.clear();

  const galaxy = scene.add.graphics();
  drawGalaxy(galaxy, {
    bulgeStrength,
    coreRadius,
    rotation, 
    tilt, 
    ...opts, 
    outerRadius,
    x: cx, 
    y: cy
  });
  renderTexture.draw(galaxy);
  galaxy.destroy();

  const coreAlpha = opts.coreAlpha ?? 1;
  const sphereR = coreRadius * 0.55 * bulgeStrength;
  const sphereAlpha = 0.15 * coreAlpha;
  const sphereFeather = Math.floor(lerp(8, 16, 0.2));

  const { sphereA, sphereB } = computeBulgeFromTilt(tilt, {
    bulgeStrength: opts.bulgeStrength ?? 1.0,
    zStrength: opts.zStrength ?? 1.0,
    tiltStart: opts.tiltStart ?? 0.35,
    tiltFull: opts.tiltFull ?? 0.85,
  });

  const drawBulgeSphere = (
    rot: number,
    sx: number,
    sy: number,
  ) => {
    const g = scene.add.graphics();
    g.setPosition(cx, cy);
  
    stampFeathered(g, 0, 0, sphereR, 0xffffff, sphereAlpha, sphereFeather);
    g.setBlendMode(Phaser.BlendModes.ADD);
    stampFeathered(g, 0, 0, sphereR * 0.55, 0xffffff, sphereAlpha * 0.55, Math.max(6, sphereFeather - 2));
    g.setBlendMode(Phaser.BlendModes.NORMAL);
  
    g.setRotation(rot);
    g.setScale(sx, sy);
  
    renderTexture.draw(g);
    g.destroy();
  };

  drawBulgeSphere(rotation, sphereA.sx, sphereA.sy);
  drawBulgeSphere(rotation + Math.PI, sphereB.sx, sphereB.sy);
  
  return renderTexture;
}

export const getGalaxyPreset = (opts?: GalaxyCompositeOptions) => {
  const presets: Record<string, GalaxyCompositeOptions> = {

  }
  return presets;
}