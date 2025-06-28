import {
  AnyPoint,
  TurnInput,
  ShotInfo,
  ObjectMovements,
  TargetCache,
  RawTurn,
} from 'shared/src/types';
import { getPosition, getRadius, getRandomBetween } from 'shared/src/utils';
import { getAngleBetween, getSquaredDistance } from './numeric';
import { addError } from './turn';
import { Collision } from 'shared/src/ecs/components/collision';
import { Position } from 'shared/src/ecs/components/position';
import { Velocity } from 'shared/src/ecs/components/velocity';
import { DEFAULT_DEATHBEAM_RADIUS } from 'shared/src/consts';
import { GameWorld } from 'shared/src/ecs/world';
import { hasComponent } from 'bitecs';
import { Destructible } from 'shared/src/ecs/components';
import { buildColliderCache } from './targeting';

const SAMPLE_STEP = 4;

export const analyzeShot = (
  trace: ReadonlyArray<AnyPoint>,
  world: GameWorld,
  sampleStep = SAMPLE_STEP,
  allObjects?: TargetCache,
): ShotInfo => {
  let closestEid = 0;
  let bestDist2 = Infinity;
  let closestPoint = { x: 0, y: 0 };
  const objects = allObjects || buildColliderCache(world);
  const shotDist2 = getSquaredDistance(trace[0], trace[trace.length - 1]);

  for (let i = 0; i < trace.length; i += sampleStep) {
    const p = trace[i];

    for (const t of objects) {
      const d2 = getSquaredDistance(p, t);

      const destructible = hasComponent(world, Destructible, t.eid);

      if (d2 <= t.r2) {
        return {
          willHit: true,
          hitsEid: t.eid,
          destructible,
          closestDestructible: t.eid,
          closestPoint: p,
          closestDist2: 0,
          shotDist2,
        }; // kill-shot
      }

      if (destructible && d2 < bestDist2) {
        bestDist2 = d2;
        closestEid = t.eid;
        closestPoint = p;
      }
    }
  }
  return {
    willHit: false,
    hitsEid: 0,
    destructible: false,
    closestDestructible: closestEid,
    closestDist2: bestDist2,
    closestPoint,
    shotDist2,
  };
};

type TargetInfo = {
  ownEid: number;
  targetEid: number;
};

export const computeFirstShot = (info: TargetInfo) => {
  const { ownEid, targetEid } = info;
  const ownPos = getPosition(ownEid);
  const targetPos = getPosition(targetEid);
  const angle = getAngleBetween(ownPos, targetPos);
  const power = 100;
  return { angle, power } as RawTurn;
};

export const correctFromLastShot = (
  targetInfo: TargetInfo,
  lastInput: TurnInput,
  shotInfo: Pick<ShotInfo, 'closestDist2'>,
) => {
  const { ownEid, targetEid } = targetInfo;

  /* ---------- geometry helpers ---------- */
  const ownPos = getPosition(ownEid);
  const targetPos = getPosition(targetEid);

  const idealAngle = getAngleBetween(ownPos, targetPos);
  const idealPower = 100;

  /* delta values */
  const dAngle = idealAngle - lastInput.angle;
  const dPower = idealPower - lastInput.power;

  let angle = lastInput.angle;
  let power = lastInput.power;

  /* ------------------------------------------------------
     1) If we were already pointing roughly at the target
        (≤ 8 °) → fix POWER first.
  ------------------------------------------------------ */
  if (Math.abs(dAngle) <= 8) {
    /* move at least 60 % toward the ideal power,
       but scale further by “how close we were”        */
    const targetRad = getRadius(targetEid);
    const closeness = Math.sqrt(shotInfo.closestDist2) / targetRad; // 0 = graze
    const factor = Math.min(0.6 + (1 - Math.min(closeness, 2)) * 0.2, 0.9);
    power += dPower * factor;
  }

  /* ------------------------------------------------------
     2) Always correct ANGLE — aggressively.
        Go 70 % of the remaining way.
  ------------------------------------------------------ */
  angle += dAngle * 0.7;

  /* ------------------------------------------------------
     3) Secondary power tweak when angle changed a lot
  ------------------------------------------------------ */
  if (Math.abs(dAngle) > 8) {
    power += dPower * 0.25; // mild nudge keeps arcs aligned
  }

  /* ------------------------------------------------------
     4) Clamp & add tiny human-like jitter
  ------------------------------------------------------ */
  angle = Math.min(Math.max(angle + (Math.random() * 4 - 2), -180), 180);
  power = Math.min(Math.max(power + getRandomBetween(-1, 1), 20), 100);

  return { angle, power } as RawTurn;
};

/** Small helpers --------------------------------------------------------- */
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);
const toUnit = (v: AnyPoint) => {
  const len = Math.hypot(v.x, v.y);
  return len === 0 ? { x: 0, y: 0 } : { x: v.x / len, y: v.y / len };
};
const dot = (a: AnyPoint, b: AnyPoint) => a.x * b.x + a.y * b.y;
const perp = (v: AnyPoint) => ({ x: -v.y, y: v.x }); // left-hand 90° turn

/** ---------------------------------------------------------------------- */
export const correctShot = (
  targetInfo: TargetInfo,
  lastInput: TurnInput,
  shotInfo: ShotInfo,
): RawTurn => {
  /* ---------------------------------------------------------------------
     Basic geometry
  --------------------------------------------------------------------- */
  const ownPos = getPosition(targetInfo.ownEid);
  const targetPos = getPosition(targetInfo.targetEid);

  // Axis from shooter ➜ target (“target axis”)
  const axis = { x: targetPos.x - ownPos.x, y: targetPos.y - ownPos.y };
  const L = Math.hypot(axis.x, axis.y); // length
  const uAxis = toUnit(axis); // unit axis
  const uPerp = perp(uAxis); // unit perpendicular (also unit-length)

  // Vector from shooter to the point of closest approach returned by the sim
  const vCP = {
    x: shotInfo.closestPoint.x - ownPos.x,
    y: shotInfo.closestPoint.y - ownPos.y,
  };

  /** ------------------------------------------------------------------
      Classify miss: along-axis component (front / behind)  + 
                     perpendicular component (above / below)
  ------------------------------------------------------------------ */
  // Signed distance along the axis
  const t = dot(vCP, uAxis); //  < L  → front (undershoot)
  //  > L  → behind (overshoot)

  // Signed perpendicular distance at the target’s position
  const perpAtTarget = dot(
    {
      x: shotInfo.closestPoint.x - targetPos.x,
      y: shotInfo.closestPoint.y - targetPos.y,
    },
    uPerp,
  ); // +  → above,  – → below

  // Thresholds (in *world* units) – tweak to taste
  const frontBackThresh = getRadius(targetInfo.targetEid) * 0.25; // within ¼ r counts as “on”
  const upDownThresh = frontBackThresh;

  /* ---------------------------------------------------------------------
     Start with previous settings; we’ll nudge them.
  --------------------------------------------------------------------- */
  let angle = lastInput.angle;
  let power = lastInput.power;

  /* ----------------- 1) POWER adjustments ---------------------------- */
  if (Math.abs(t - L) > frontBackThresh) {
    power += (t < L ? +1 : -1) * 10; // ±10-power shove
  }

  /* ----------------- 2) ANGLE adjustments ---------------------------- */
  if (Math.abs(perpAtTarget) > upDownThresh) {
    angle -= (perpAtTarget > 0 ? +1 : -1) * 6; // ±6 degrees nudge
  }

  /* ----------------- 3) Clamp & add “human” jitter ------------------- */
  // angle = clamp(angle + (Math.random() * 4 - 2), -180, 180);
  // power = clamp(power + getRandomBetween(-1, 1), 20, 100);
  angle = clamp(angle, -180, 180);
  power = clamp(power, 20, 100);

  return { angle, power };
};

export const checkDangerousShots = (
  ownEid: number,
  lastTurnShots: ObjectMovements,
  radBuffer = 3,
  sampleStep = SAMPLE_STEP,
) => {
  const ownPos = getPosition(ownEid);
  const ownRad = getRadius(ownEid);
  const HYPERSPACE_DIST2 = Math.pow(ownRad * radBuffer, 2);

  for (const key in lastTurnShots) {
    if (key === String(ownEid)) {
      continue;
    }
    const trace = lastTurnShots[key].movementTrace;
    for (let i = 0; i < trace.length; i += sampleStep) {
      const p = trace[i];
      const dx = p.x - ownPos.x;
      const dy = p.y - ownPos.y;
      if (dx * dx + dy * dy < HYPERSPACE_DIST2) {
        return true;
      }
    }
  }
  return false;
};

export const inputsToShot = (
  parentEid: number,
  eid: number,
  input: RawTurn,
) => {
  const fasterSpeed = input.power * 2;
  const angleRad = input.angle * (Math.PI / 180);
  const offset = Collision.radius[parentEid] + DEFAULT_DEATHBEAM_RADIUS;
  Position.x[eid] = Position.x[parentEid] + Math.cos(angleRad) * offset;
  Position.y[eid] = Position.y[parentEid] + Math.sin(angleRad) * offset;
  Velocity.x[eid] = Math.cos(angleRad) * fasterSpeed;
  Velocity.y[eid] = Math.sin(angleRad) * fasterSpeed;
};

export const explore = (lastInput: RawTurn) =>
  addError(lastInput, 40, 1.2 + Math.random() * 0.3);

// export const isStuck = (sim: SimResult, sim2: SimResult): boolean => {
//   // no collision on at least one sim, so as far as we know, we're not stuck
//   if (sim.firstCollisionEid === 0) {
//     return false;
//   }
//   const sameHit = sim.firstCollisionEid === sim2.firstCollisionEid;
//   const sameTime = Math.abs(sim.firstCollisionT - sim2.firstCollisionT) < 300;
//   return sameHit && sameTime;
// };
