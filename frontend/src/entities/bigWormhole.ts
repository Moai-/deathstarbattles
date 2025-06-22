import { IWorld } from 'bitecs';
import { createWormhole } from './wormhole';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from 'src/render/components/renderable';
import { RenderableTypes } from 'src/render/types';
import { MAX_SUPERGIANT_RAD, MIN_SUPERGIANT_RAD } from './supergiant';

export const createBigWormhole = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createWormhole(world, x, y, radius);
  HasGravity.strength[eid] = radius;
  Renderable.type[eid] = RenderableTypes.BIG_WORMHOLE;
  return eid;
};

export const createRandomBigWormhole = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_SUPERGIANT_RAD, MAX_SUPERGIANT_RAD);
  return createBigWormhole(world, 0, 0, radius);
};
