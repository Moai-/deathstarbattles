import { addComponent, IWorld } from 'bitecs';
import { createLocus } from './hyperLocus';
import {
  Collision,
  HasGravity,
  ObjectInfo,
  Position,
} from 'shared/src/ecs/components';
import { ObjectTypes } from 'shared/src/types';
import { Renderable } from 'src/render/components/renderable';
import { generateRandomCol } from 'shared/src/utils';
import { GravityFalloffType } from 'shared/src/ecs/components/hasGravity';

const LOCUS_RAD = 10;

export const createTunnelLocus = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createLocus(world);
  addComponent(world, Position, eid);
  addComponent(world, Collision, eid);
  addComponent(world, HasGravity, eid);
  addComponent(world, Renderable, eid);

  ObjectInfo.type[eid] = ObjectTypes.TUNNEL_LOCUS;
  Renderable.col[eid] = generateRandomCol(
    { r: 230, g: 70, b: 40 },
    { r: 25, g: 10, b: 10 },
  );
  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = 300;
  HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
  return eid;
};

export const createRandomTunnelLocus = (world: IWorld) => {
  return createTunnelLocus(world, 0, 0, LOCUS_RAD);
};
