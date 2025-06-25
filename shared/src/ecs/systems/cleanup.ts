import { defineQuery, defineSystem, removeEntity } from 'bitecs';
import { GameWorld } from '../world';
import { HIDDEN_BOUNDARY, BASE_WIDTH, BASE_HEIGHT } from 'shared/src/consts';
import { AllComponents } from '../components';

const DEFAULT_PROJECTILE_LIFETIME = 30;

const bMin = 0 - HIDDEN_BOUNDARY;
const bxMax = BASE_WIDTH + HIDDEN_BOUNDARY;
const byMax = BASE_HEIGHT + HIDDEN_BOUNDARY;

export const createCleanupSystem = (
  { Position, Velocity, HasLifetime }: AllComponents,
  onEntityCleanedUp: (eid: number) => void = () => {},
) => {
  const boundQuery = defineQuery([Position, Velocity]);
  const timeoutQuery = defineQuery([HasLifetime]);
  return defineSystem((world) => {
    const boundaryEntities = boundQuery(world);
    for (const eid of boundaryEntities) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      if (x < bxMax && x > bMin) {
        if (y < byMax && y > bMin) {
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
