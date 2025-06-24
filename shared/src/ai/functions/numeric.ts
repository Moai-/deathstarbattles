import { AnyPoint } from 'shared/src/types';
import { MAX_DIST_SQ } from '../consts';

export const getSquaredDistance = (a: AnyPoint, b: AnyPoint) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const getAngleBetween = (a: AnyPoint, b: AnyPoint) => {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};

export const getPower = (ownPoint: AnyPoint, target: AnyPoint, error = 0) => {
  const sqDist = getSquaredDistance(ownPoint, target);
  const rawPower = sqDist > MAX_DIST_SQ ? 100 : (sqDist / MAX_DIST_SQ) * 100;
  return Math.min(Math.max(rawPower + error, 20), 100);
};
