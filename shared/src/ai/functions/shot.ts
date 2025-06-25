import {
  AnyPoint,
  TurnInput,
  ShotInfo,
  ObjectMovements,
} from 'shared/src/types';
import { getPosition, getRadius, getRandomBetween } from 'shared/src/utils';
import { getAngleBetween } from './numeric';
import { addError, RawTurn } from './turn';
import { Collision } from 'shared/src/ecs/components/collision';
import { Position } from 'shared/src/ecs/components/position';
import { Velocity } from 'shared/src/ecs/components/velocity';
import { DEFAULT_DEATHBEAM_RADIUS } from 'shared/src/consts';
import { SimResult } from '../simulation/types';

const SAMPLE_STEP = 4;

export const analyzeLastShot = (
  trace: ReadonlyArray<AnyPoint>,
  targets: Array<{ x: number; y: number; eid: number; r2: number }>,
  sampleStep = SAMPLE_STEP,
): { willHit: boolean; closest: number | null; dist2: number } => {
  let closestEid: number | null = null;
  let bestDist2 = Infinity;

  for (let i = 0; i < trace.length; i += sampleStep) {
    const p = trace[i];

    for (const t of targets) {
      const dx = p.x - t.x;
      const dy = p.y - t.y;
      const d2 = dx * dx + dy * dy;

      if (d2 <= t.r2) return { willHit: true, closest: t.eid, dist2: 0 }; // kill-shot

      if (d2 < bestDist2) {
        bestDist2 = d2;
        closestEid = t.eid;
      }
    }
  }
  return { willHit: false, closest: closestEid, dist2: bestDist2 };
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
  shotInfo: Pick<ShotInfo, 'dist2'>,
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
    const closeness = Math.sqrt(shotInfo.dist2) / targetRad; // 0 = graze
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

export const isStuck = (sim: SimResult, sim2: SimResult): boolean => {
  // no collision on at least one sim, so as far as we know, we're not stuck
  if (sim.firstCollisionEid === 0) {
    return false;
  }
  const sameHit = sim.firstCollisionEid === sim2.firstCollisionEid;
  const sameTime = Math.abs(sim.firstCollisionT - sim2.firstCollisionT) < 300;
  return sameHit && sameTime;
};
