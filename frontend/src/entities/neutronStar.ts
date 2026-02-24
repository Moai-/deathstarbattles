import { World } from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol } from 'shared/src/utils';
import { createCollidingBase } from './bases';
import { addJets } from './jets';

const MIN_STAR_RAD = 6;
const MAX_STAR_RAD = 12;

export const createNeutronStar = (
  world: World,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.NEUTRON_STAR);
  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = (radius + 20) * 1500;
  addJets(eid, world, {
    axisAngleRad: Phaser.Math.FloatBetween(0, Math.PI * 2),
    spreadRad: Phaser.Math.DegToRad(12),
    deflectAngleRad: Phaser.Math.DegToRad(10),
    strength: 8,
  });

  Renderable.col[eid] = generateRandomCol(
    { r: 200, g: 150, b: 230 },
    { r: 25, g: 25, b: 25 },
  );

  return eid;
};

export const createRandomNeutronStar = (world: World) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createNeutronStar(world, 0, 0, radius);
};
