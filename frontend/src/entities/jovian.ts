import { World } from 'bitecs';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol } from 'shared/src/utils';
import { createCollidingBase } from './bases';

export const MIN_RAD = 70;
export const MAX_RAD = 230;

export const createJovian = (
  world: World,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.JOVIAN);

  HasGravity.strength[eid] = radius * 80;
  Renderable.col[eid] = generateRandomCol(
    { r: 140, g: 0, b: 0 },
    { r: 111, g: 121, b: 51 },
  );

  return eid;
};

export const createRandomJovian = (world: World) => {
  const radius = Phaser.Math.Between(MIN_RAD, MAX_RAD);
  return createJovian(world, 0, 0, radius);
};
