import { defineQuery, defineSystem, removeEntity } from 'bitecs';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';
import { HasLifetime } from '../components/hasLifetime';
import { GameWorld } from '../world';

const boundQuery = defineQuery([Position, Velocity]);
const timeoutQuery = defineQuery([HasLifetime]);

const DEFAULT_PROJECTILE_LIFETIME = 30;

export const createCleanupSystem = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  onEntityCleanedUp: (eid: number) => void = () => {},
) => {
  return defineSystem((world) => {
    const boundaryEntities = boundQuery(world);
    for (const eid of boundaryEntities) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      if (x < maxX && x > minX) {
        if (y < maxY && y > minY) {
          continue;
        }
      }
      removeEntity(world, eid);
      onEntityCleanedUp(eid);
    }

    const timedOutEntities = timeoutQuery(world);
    for (const eid of timedOutEntities) {
      if (
        (world as GameWorld).time - HasLifetime.createdAt[eid] >=
        DEFAULT_PROJECTILE_LIFETIME * 1000
      ) {
        removeEntity(world, eid);
        onEntityCleanedUp(eid);
      }
    }
    return world;
  });
};
