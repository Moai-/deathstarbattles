import { IWorld } from 'bitecs';
import { createWormhole } from './wormhole';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { MAX_SUPERGIANT_RAD, MIN_SUPERGIANT_RAD } from './supergiant';
import { ObjectTypes } from 'shared/src/types';
import { ObjType } from 'shared/src/ecs/components/objType';

export const createBigWormhole = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createWormhole(world, x, y, radius);
  HasGravity.strength[eid] = radius * 50;
  ObjType.type[eid] = ObjectTypes.BIG_WORMHOLE;
  return eid;
};

export const createRandomBigWormhole = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_SUPERGIANT_RAD, MAX_SUPERGIANT_RAD);
  return createBigWormhole(world, 0, 0, radius);
};
