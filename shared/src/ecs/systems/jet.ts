import { query } from "bitecs";
import { Position, Active, Velocity } from "../components";
import { HasPolarJets } from "../components/hasPolarJets";
import { GameWorld } from "../world";
import { AffectedByJets } from "../components/affectedByJets";

const JET_EPS = 1e-6;

const jetSourceEntities = [HasPolarJets, Position, Active];
const jetTargetEntities = [AffectedByJets, Velocity, Position, Active];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Smoothstep (classic)
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / Math.max(JET_EPS, edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const applyOneJet = (
  dt: number,
  // projectile pos
  px: number,
  py: number,
  // source pos
  sx: number,
  sy: number,
  // jet basis
  dirX: number,
  dirY: number,
  perpX: number,
  perpY: number,
  // params
  innerRadius: number,
  length: number,
  tanHalfSpread: number,
  strength: number,
  corePow: number,
  endFadeFrac: number,
  outerFadeBias: number,
  deflectAngleRad: number,
  // output
  out: { ax: number; ay: number },
) => {
  const rx = px - sx;
  const ry = py - sy;
  const xLocal = rx * dirX + ry * dirY;
  const yLocal = rx * perpX + ry * perpY;
  

  if (xLocal < innerRadius) return;
  const xMax = innerRadius + length;
  if (xLocal > xMax) return;

  const dx = xLocal - innerRadius;
  const halfWidth = dx * tanHalfSpread;
  const absY = Math.abs(yLocal);

  if (absY > halfWidth) return;

  // 0..1 along the jet
  const u = clamp01(dx / Math.max(JET_EPS, length));

  // Core proximity: 1 at centerline, 0 at edge
  let core = 1 - absY / Math.max(JET_EPS, halfWidth);
  core = Math.pow(clamp01(core), Math.max(0.0001, corePow));

  const fadeFrac = clamp01(endFadeFrac);
  if (fadeFrac > 0) {
    const start = 1 - fadeFrac;

    const shift = outerFadeBias * (1 - core); // 0 at core, max at edge
    const startShifted = clamp01(start - shift * fadeFrac);

    const s = smoothstep(startShifted, 1, u); // 0..1
    const tail = 1 - s;                      // 1..0
    if (tail <= 0) return;

    // Deflection: rotate away from centerline more when near edges
    const side = yLocal >= 0 ? 1 : -1;
    const angleOffAxis = deflectAngleRad * (1 - core) * side;

    const ca = Math.cos(angleOffAxis);
    const sa = Math.sin(angleOffAxis);

    // rotate (dirX, dirY) by angleOffAxis
    const fx = dirX * ca - dirY * sa;
    const fy = dirX * sa + dirY * ca;

    const a = strength * core * tail;
    out.ax += fx * a;
    out.ay += fy * a;
    return;
  }

  // No end fade case
  const side = yLocal >= 0 ? 1 : -1;
  const angleOffAxis = deflectAngleRad * (1 - core) * side;

  const ca = Math.cos(angleOffAxis);
  const sa = Math.sin(angleOffAxis);

  const fx = dirX * ca - dirY * sa;
  const fy = dirX * sa + dirY * ca;

  const a = strength * core;
  out.ax += fx * a;
  out.ay += fy * a;
};

export const createPolarJetSystem = () => {
  return (world: GameWorld) => {
    const dt = world.delta;
    const sources = query(world, jetSourceEntities);
    const targets = query(world, jetTargetEntities);

    for (const eid of targets) {
      const px = Position.x[eid];
      const py = Position.y[eid];

      const acc = { ax: 0, ay: 0 };

      for (const sid of sources) {
        const sx = Position.x[sid];
        const sy = Position.y[sid];

        const strength = HasPolarJets.jetStrength[sid];
        const innerRadius = HasPolarJets.innerRadius[sid];
        const length = HasPolarJets.length[sid];
        const tanHalf = HasPolarJets.tanHalfSpread[sid];

        const dirX = HasPolarJets.dirX[sid];
        const dirY = HasPolarJets.dirY[sid];
        const perpX = HasPolarJets.perpX[sid];
        const perpY = HasPolarJets.perpY[sid];

        const corePow = HasPolarJets.corePow[sid] || 2.2;
        const endFadeFrac = HasPolarJets.endFadeFrac[sid] ?? 0.22;
        const outerFadeBias = HasPolarJets.outerFadeBias[sid] ?? 0.75;
        const deflectAngleRad = HasPolarJets.deflectAngleRad[sid] ?? 0;

        // Jet +dir
        applyOneJet(
          dt, px, py, sx, sy,
          dirX, dirY, perpX, perpY,
          innerRadius, length, tanHalf,
          strength, corePow,
          endFadeFrac, outerFadeBias,
          deflectAngleRad,
          acc,
        );

        // Jet -dir (opposite pole)
        applyOneJet(
          dt, px, py, sx, sy,
          -dirX, -dirY, -perpX, -perpY,
          innerRadius, length, tanHalf,
          strength, corePow,
          endFadeFrac, outerFadeBias,
          deflectAngleRad,
          acc,
        );
      }

      Velocity.x[eid] += acc.ax * dt;
      Velocity.y[eid] += acc.ay * dt;
    }

    return world;
  }
};

