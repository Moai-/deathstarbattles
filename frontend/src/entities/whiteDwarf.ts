import { IWorld } from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol } from 'shared/src/utils';
import { createCollidingBase } from './bases';

const MIN_STAR_RAD = 6;
const MAX_STAR_RAD = 12;

export const createWhiteDwarf = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.WHITE_DWARF);
  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = (radius + 20) * 1500;
  Renderable.col[eid] = generateRandomCol(
    { r: 230, g: 230, b: 230 },
    { r: 25, g: 25, b: 25 },
  );

  return eid;
};

export const createRandomWhiteDwarf = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createWhiteDwarf(world, 0, 0, radius);
};
