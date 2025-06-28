import { IWorld } from 'bitecs';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol } from 'shared/src/utils';
import { createCollidingBase } from './bases';

const MIN_STAR_RAD = 250;
const MAX_STAR_RAD = 350;

export const createRedGiant = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.RED_GIANT);

  HasGravity.strength[eid] = radius * 80;
  Renderable.col[eid] = generateRandomCol(
    { r: 230, g: 70, b: 40 },
    { r: 25, g: 10, b: 10 },
  );

  return eid;
};

export const createRandomRedGiant = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createRedGiant(world, 0, 0, radius);
};
