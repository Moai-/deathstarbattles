import { IWorld } from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { ObjectTypes } from 'shared/src/types';
import { createCollidingBase } from './bases';

export const BLACK_HOLE_RAD = 4;

export const createBlackHole = (world: IWorld, x: number, y: number) => {
  const eid = createCollidingBase(
    world,
    x,
    y,
    BLACK_HOLE_RAD,
    ObjectTypes.BLACK_HOLE,
  );

  Collision.radius[eid] = BLACK_HOLE_RAD;
  HasGravity.strength[eid] = 20000;

  return eid;
};

export const createRandomBlackHole = (world: IWorld) => {
  return createBlackHole(world, 0, 0);
};
