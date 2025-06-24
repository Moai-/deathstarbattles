import {
  AnyPoint,
  TurnInput,
  ShotInfo,
  ObjectMovements,
} from 'shared/src/types';
import { getPosition, getRadius } from 'shared/src/utils';
import { getAngleBetween, getPower } from './numeric';
import { RawTurn } from './turn';

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
