import { World } from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { ObjectTypes } from 'shared/src/types';
import { createCollidingBase } from './bases';

export const MIN_PLANET_RAD = 30;
export const MAX_PLANET_RAD = 70;

export const createPlanet = (
  world: World,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.PLANET);

  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = radius * 90;

  return eid;
};

export const createRandomPlanet = (world: World) => {
  const radius = Phaser.Math.Between(MIN_PLANET_RAD, MAX_PLANET_RAD);
  return createPlanet(world, 0, 0, radius);
};
