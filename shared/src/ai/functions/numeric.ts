import { AnyPoint } from 'shared/src/types';

export const getSquaredDistance = (a: AnyPoint, b: AnyPoint) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const getAngleBetween = (a: AnyPoint, b: AnyPoint) => {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};
