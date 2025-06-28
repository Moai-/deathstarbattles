import {
  AnyPoint,
  TurnInput,
  ShotInfo,
  ObjectMovements,
  TargetCache,
  RawTurn,
  SimShotResult,
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

export type TargetInfo = {
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

/* ---------------- helpers ------------------------------------------------ */
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const dist2 = (a: AnyPoint, b: AnyPoint) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const dot = (a: AnyPoint, b: AnyPoint) => a.x * b.x + a.y * b.y;
const perpZ = (a: AnyPoint, b: AnyPoint) => a.x * b.y - a.y * b.x; // 2-D cross product “z” term

/* ------------------------------------------------------------------------ */
export const correctShot = (
  targetInfo: TargetInfo,
  lastInput: TurnInput,
  shotInfo: ShotInfo,
): RawTurn => {
  const shooter = getPosition(targetInfo.ownEid);
  const target = getPosition(targetInfo.targetEid);

  /* ---------------------------------------------------------------------
     STEP 0  –  OBSTACLE AVOIDANCE
     ---------------------------------------------------------------
     Triggered when the last shell collided with a non-destructible
     body that is *closer to us than to the real target*.
  --------------------------------------------------------------------- */
  const obstacleHit =
    shotInfo.hitsEid !== 0 &&
    !shotInfo.destructible &&
    dist2(shooter, getPosition(shotInfo.hitsEid)) < dist2(shooter, target);

  if (obstacleHit) {
    const obstacle = getPosition(shotInfo.hitsEid);
    const rObst = getRadius(shotInfo.hitsEid);
    const vSO = { x: obstacle.x - shooter.x, y: obstacle.y - shooter.y };
    const dSO2 = vSO.x * vSO.x + vSO.y * vSO.y;
    const dSO = Math.sqrt(dSO2);

    /* Shooter sits *inside* obstacle – very rare, bail out */
    if (dSO <= rObst) {
      return { angle: lastInput.angle, power: lastInput.power };
    }

    /* Angle between shooter→obstacle axis and its tangents  */
    const deltaRad = Math.asin(rObst / dSO); // tangent deflection
    const safetyDeg = 3; // add 3° buffer
    const deltaDeg = toDeg(deltaRad) + safetyDeg;

    /* Decide which side (sign) puts us on the same side as the target */
    const cross = perpZ(vSO, {
      x: target.x - shooter.x,
      y: target.y - shooter.y,
    });
    const sideSign = Math.sign(cross) || 1; //  0 ⇒ pick CCW by default

    const axisDeg = toDeg(Math.atan2(vSO.y, vSO.x)); //  shooter → obstacle
    const newAngle = axisDeg + sideSign * deltaDeg;

    /* Extra juice so gravity can bend it round the planet */
    const newPower = clamp(lastInput.power + 12, 20, 100);

    return {
      angle: clamp(newAngle + (Math.random() * 4 - 2), -180, 180),
      power: clamp(newPower + getRandomBetween(-1, 1), 20, 100),
    };
  }

  /* ---------------------------------------------------------------------
     STEP 1  –  NORMAL “EIGHT-WAY” CORRECTION (unchanged)
  --------------------------------------------------------------------- */
  const axis = { x: target.x - shooter.x, y: target.y - shooter.y };
  const L = Math.hypot(axis.x, axis.y);
  const uAxis = { x: axis.x / L, y: axis.y / L };
  const uPerp = { x: -uAxis.y, y: uAxis.x };

  const vCP = {
    x: shotInfo.closestPoint.x - shooter.x,
    y: shotInfo.closestPoint.y - shooter.y,
  };

  const t = dot(vCP, uAxis); // along-axis component
  const perpAtTarget =
    (shotInfo.closestPoint.x - target.x) * uPerp.x +
    (shotInfo.closestPoint.y - target.y) * uPerp.y;

  const thresh = getRadius(targetInfo.targetEid) * 0.25;

  let angle = lastInput.angle;
  let power = lastInput.power;

  /* power: front / behind */
  if (Math.abs(t - L) > thresh) {
    power += (t < L ? +1 : -1) * 10;
  }

  /* angle: above / below  (fixed-sign logic) */
  const signPerp = Math.sign(perpAtTarget);
  if (Math.abs(perpAtTarget) > thresh) {
    angle -= signPerp * 6;
  }

  /* polish */
  angle = clamp(angle + (Math.random() * 4 - 2), -180, 180);
  power = clamp(power + getRandomBetween(-1, 1), 20, 100);

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

type SequencerResult = {
  sim: SimShotResult;
  paths: Array<Array<AnyPoint>>;
};

export const shotSequencer = async (
  targetData: TargetInfo,
  turnInput: TurnInput,
  simulateShot: (t: TurnInput) => Promise<SimShotResult>,
  sequenceAmount: number,
  previousResults?: Array<SimShotResult>,
): Promise<SequencerResult> => {
  const closest = previousResults
    ? previousResults.sort((a, b) => a.closestDist2 - b.closestDist2)[0]
    : null;

  const targetEid =
    closest !== null
      ? closest.hitsSelf
        ? targetData.targetEid
        : closest.closestDestructible
      : targetData.targetEid;

  const target = { ...targetData, targetEid };

  const inputs = closest
    ? { ...turnInput, ...correctShot(target, turnInput, closest) }
    : turnInput;

  const sim = await simulateShot(inputs);

  const paths = previousResults
    ? [...previousResults.map((r) => r.shotTrail), sim.shotTrail]
    : [sim.shotTrail];

  if (sim.willHit && !sim.hitsSelf) {
    return {
      sim,
      paths,
    };
  }

  const nextSequence = sequenceAmount - 1;
  if (nextSequence < 0) {
    return {
      sim: closest && closest.closestDist2 < sim.closestDist2 ? closest : sim,
      paths,
    };
  }
  const previous = previousResults ? [...previousResults, sim] : [sim];
  return shotSequencer(target, inputs, simulateShot, nextSequence, previous);
};
