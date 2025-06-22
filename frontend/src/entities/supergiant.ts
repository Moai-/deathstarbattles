import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import {
  GravityFalloffType,
  HasGravity,
} from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';

export const MIN_SUPERGIANT_RAD = 1000;
export const MAX_SUPERGIANT_RAD = 3000;

export const createSupergiant = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Collision, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, HasGravity, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = radius / 8;
  HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
  Renderable.type[eid] = RenderableTypes.SUPERGIANT;
  Renderable.col[eid] = generateRandomSupergiantCol();

  return eid;
};

export const createRandomSupergiant = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_SUPERGIANT_RAD, MAX_SUPERGIANT_RAD);
  return createSupergiant(world, 0, 0, radius);
};

export const generateRandomSupergiantCol = () => {
  const r = 253 + Math.floor(Math.random() * 3);
  const g = 40 + Math.floor(Math.random() * 216);
  const b = 10 + Math.floor(Math.random() * 51);

  return (r << 16) | (g << 8) | b;
};
