import { IWorld } from 'bitecs';
import {
  GravityFalloffType,
  HasGravity,
} from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol } from 'shared/src/utils';
import { createCollidingBase } from './bases';

export const MIN_SUPERGIANT_RAD = 1000;
export const MAX_SUPERGIANT_RAD = 3000;

export const createSupergiant = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.SUPERGIANT);

  HasGravity.strength[eid] = radius / 8;
  HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
  Renderable.col[eid] = generateRandomCol(
    { r: 253, g: 40, b: 10 },
    { r: 3, g: 216, b: 51 },
  );

  return eid;
};

export const createRandomSupergiant = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_SUPERGIANT_RAD, MAX_SUPERGIANT_RAD);
  return createSupergiant(world, 0, 0, radius);
};
