import { hasComponent, IWorld } from 'bitecs';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { GameWorld } from 'shared/src/ecs/world';
import { GameObject, TargetCache } from 'shared/src/types';
import { getPosition, getRadius } from 'shared/src/utils';
import { getSquaredDistance } from './numeric';

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

export const getClosestDestructible = (
  world: GameWorld,
  ownEid: number,
  allObjects: Array<GameObject>,
) => {
  const otherTargets = getOtherDestructibles(world, ownEid, allObjects);
  return getClosestTarget(ownEid, otherTargets);
};

export const buildTargetCache = (
  playerId: number,
  world: IWorld,
  gameObjects: Array<GameObject>,
): TargetCache =>
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
