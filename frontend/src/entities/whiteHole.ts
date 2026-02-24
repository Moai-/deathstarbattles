import { World } from 'bitecs';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol } from 'shared/src/utils';
import { createCollidingBase } from './bases';

const MIN_STAR_RAD = 6;
const MAX_STAR_RAD = 12;

export const createWhiteHole = (
  world: World,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.WHITE_HOLE);

  HasGravity.strength[eid] = (radius + 20) * 1500 * -1;
  Renderable.col[eid] = generateRandomCol(
    { r: 230, g: 230, b: 230 },
    { r: 25, g: 25, b: 25 },
  );

  return eid;
};

export const createRandomWhiteHole = (world: World) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createWhiteHole(world, 0, 0, radius);
};
