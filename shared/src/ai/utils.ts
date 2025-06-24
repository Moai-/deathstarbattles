import { hasComponent, IWorld } from 'bitecs';
import {
  AnyPoint,
  GameObject,
  ObjectMovements,
  OtherActions,
  ShotInfo,
  TurnInput,
} from '../types';
import { GameWorld } from '../ecs/world';
import { Destructible } from '../ecs/components/destructible';
import { Position } from '../ecs/components/position';
import { MAX_DIST_SQ } from './consts';
import { Collision } from '../ecs/components/collision';

const SAMPLE_STEP = 4;

export const oneIn = (fraction: number) => Math.random() < 1 / fraction;

export const getRandomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getOtherDestructibles = (
  world: GameWorld,
  ownEid: number,
  allObjects: Array<GameObject>,
) => {
  return allObjects.filter((object) => {
    if (object.eid === ownEid) {
      return false;
    }
    if (hasComponent(world, Destructible, object.eid)) {
      return true;
    }
    return false;
  });
};

export const getRadius = (eid: number) => Collision.radius[eid];

export const getPosition = (eid: number) => ({
  x: Position.x[eid],
  y: Position.y[eid],
});

export const getClosestTarget = (
  ownEid: number,
  targets: Array<GameObject>,
) => {
  const ownPoint = getPosition(ownEid);
  return targets
    .map((target) => {
      const targetPoint = { x: target.x, y: target.y };
      return {
        eid: target.eid,
        dist: getSquaredDistance(targetPoint, ownPoint),
      };
    })
    .sort((a, b) => a.dist - b.dist)[0].eid;
};

export const getSquaredDistance = (a: AnyPoint, b: AnyPoint) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const getClosestDestructible = (
  world: GameWorld,
  ownEid: number,
  allObjects: Array<GameObject>,
) => {
  const otherTargets = getOtherDestructibles(world, ownEid, allObjects);
  return getClosestTarget(ownEid, otherTargets);
};

export const getAngleBetween = (a: AnyPoint, b: AnyPoint) => {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};

export const getPower = (ownPoint: AnyPoint, target: AnyPoint, error = 0) => {
  const sqDist = getSquaredDistance(ownPoint, target);
  const rawPower = sqDist > MAX_DIST_SQ ? 100 : (sqDist / MAX_DIST_SQ) * 100;
  return Math.min(Math.max(rawPower + error, 20), 100);
};

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

type RawTurn = Pick<TurnInput, 'angle' | 'power'>;

export const computeFirstShot = (info: TargetInfo) => {
  const { ownEid, targetEid } = info;
  const ownPos = getPosition(ownEid);
  const targetPos = getPosition(targetEid);
  const angle = getAngleBetween(ownPos, targetPos);
  const power = getPower(ownPos, targetPos);
  return { angle, power } as RawTurn;
};

export const correctFromLastShot = (
  targetInfo: TargetInfo,
  lastInput: TurnInput,
  shotInfo: Pick<ShotInfo, 'dist2'>,
  angleTolerance = 8,
) => {
  const { ownEid, targetEid } = targetInfo;
  const ownPos = getPosition(ownEid);
  const targetPos = getPosition(targetEid);
  const targetRad = getRadius(targetEid);

  const idealAngle = getAngleBetween(ownPos, targetPos);
  const idealPower = getPower(ownPos, targetPos, 0);

  const angleErr = idealAngle - lastInput.angle;
  const angleErrAbs = Math.abs(angleErr);

  let angle = lastInput.angle;
  let power = lastInput.power;

  if (angleErrAbs <= angleTolerance) {
    const closeness = Math.sqrt(shotInfo.dist2) / targetRad;
    const k = Math.min(closeness, 2) * 0.15; // clamp to 30% max
    const sign = idealPower < lastInput.power ? -1 : 1;
    power = lastInput.power * (1 - sign * k);
  } else {
    angle += angleErr * 0.5; // half-way
  }

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

export const buildTargetCache = (
  playerId: number,
  world: IWorld,
  gameObjects: Array<GameObject>,
) =>
  gameObjects
    .filter(
      (o) => hasComponent(world, Destructible, o.eid) && o.eid !== playerId,
    )
    .map((o) => ({
      eid: o.eid,
      x: o.x,
      y: o.y,
      r2: Math.pow(getRadius(o.eid), 2),
    }));

export const hyperspaceTurn = (playerId: number) =>
  ({
    playerId,
    angle: 0,
    power: 20,
    otherAction: OtherActions.HYPERSPACE,
  }) as TurnInput;

export const shotTurn = (playerId: number, turn: RawTurn) =>
  ({
    ...turn,
    playerId,
    otherAction: null,
  }) as TurnInput;

export const addError = (turn: RawTurn, angleError = 10, powerError = 3) =>
  ({
    angle: Math.min(
      Math.max(turn.angle + getRandomBetween(-angleError, angleError), -180),
      180,
    ),
    power: Math.min(
      Math.max(turn.power + getRandomBetween(-powerError, powerError), 20),
      100,
    ),
  }) as RawTurn;
