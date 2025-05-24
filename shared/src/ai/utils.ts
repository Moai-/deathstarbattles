import { hasComponent } from 'bitecs';
import { AnyPoint, GameObject } from '../types';
import { GameWorld } from '../ecs/world';
import { Destructible } from '../ecs/components/destructible';
import { Position } from '../ecs/components/position';
import { MAX_DIST_SQ } from './consts';

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

export const getRandomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getAngleBetween = (a: AnyPoint, b: AnyPoint) => {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};

export const getPower = (ownPoint: AnyPoint, target: AnyPoint, error = 0) => {
  const sqDist = getSquaredDistance(ownPoint, target);
  const rawPower = sqDist > MAX_DIST_SQ ? 100 : (sqDist / MAX_DIST_SQ) * 100;
  return Math.min(Math.max(rawPower + error, 20), 100);
};
