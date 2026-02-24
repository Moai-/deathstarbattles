import { World } from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { ObjectTypes } from 'shared/src/types';
import { createCollidingBase } from './bases';
import { addJets } from './jets';

export const BLACK_HOLE_RAD = 8;

export const createJetBlackHole = (world: World, x: number, y: number) => {
  const eid = createCollidingBase(
    world,
    x,
    y,
    BLACK_HOLE_RAD,
    ObjectTypes.JET_BLACK_HOLE,
  );

  Collision.radius[eid] = BLACK_HOLE_RAD;
  HasGravity.strength[eid] = Phaser.Math.Between(10000, 20000);
  addJets(eid, world, {
    axisAngleRad: Phaser.Math.FloatBetween(0, Math.PI * 2),
    spreadRad: Phaser.Math.DegToRad(12),
    deflectAngleRad: Phaser.Math.DegToRad(10),
    length: Phaser.Math.Between(500, 1000),
    strength: 20,
  });
  return eid;
};

export const createRandomJetBlackHole = (world: World) => {
  return createJetBlackHole(world, 0, 0);
};
