import { IWorld } from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { ObjectTypes } from 'shared/src/types';
import { createCollidingBase } from './bases';

export const MIN_ASTEROID_RAD = 15;
export const MAX_ASTEROID_RAD = 35;

export const createAsteroid = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.ASTEROID);

  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = radius * 60;

  return eid;
};

export const createRandomAsteroid = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_ASTEROID_RAD, MAX_ASTEROID_RAD);
  return createAsteroid(world, 0, 0, radius);
};
