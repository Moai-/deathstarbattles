import { World } from 'bitecs';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { createCollidingBase } from './bases';
import { generateRandomCol } from 'shared/src/utils';

const MIN_STAR_RAD = 180;
const MAX_STAR_RAD = 300;

export const createStar = (
  world: World,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.STAR);
  HasGravity.strength[eid] = radius * 100;
  Renderable.col[eid] = generateRandomCol(
    { r: 254, g: 250, b: 100 },
    { r: 2, g: 6, b: 156 },
  );

  return eid;
};

export const createRandomStar = (world: World) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createStar(world, 0, 0, radius);
};
