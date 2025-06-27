import { hasComponent } from 'bitecs';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { GameWorld } from 'shared/src/ecs/world';
import { TargetCache } from 'shared/src/types';
import {
  getColliders,
  getPosition,
  getRadius,
  getTargets,
} from 'shared/src/utils';
import { getSquaredDistance } from './numeric';
import { Position } from 'shared/src/ecs/components';

export const getClosestTarget = (ownEid: number, targets: TargetCache) => {
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

export const getClosestDestructible = (world: GameWorld, ownEid: number) => {
  const otherTargets = buildTargetCache(ownEid, world);
  return getClosestTarget(ownEid, otherTargets);
};

export const buildColliderCache = (world: GameWorld): TargetCache =>
  getColliders(world).map((o) => ({
    eid: o,
    breaks: hasComponent(world, Destructible, o),
    x: Position.x[o],
    y: Position.y[o],
    r: getRadius(o),
    r2: Math.pow(getRadius(o), 2),
  }));

export const buildTargetCache = (
  player: number,
  world: GameWorld,
): TargetCache =>
  getTargets(world)
    .map((o) => ({
      eid: o,
      breaks: hasComponent(world, Destructible, o),
      x: Position.x[o],
      y: Position.y[o],
      r: getRadius(o),
      r2: Math.pow(getRadius(o), 2),
    }))
    .filter((o) => o.eid !== player);
