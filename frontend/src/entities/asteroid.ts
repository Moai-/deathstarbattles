import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';

export const MIN_ASTEROID_SIZE = 10;
export const MAX_ASTEROID_SIZE = 50;

export const createAsteroid = (
  world: IWorld,
  x: number,
  y: number,
  size: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, HasGravity, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Renderable.type[eid] = RenderableTypes.ASTEROID;
  Renderable.size[eid] = size;
  HasGravity.strength[eid] = size * 25;

  return eid;
};

export const createRandomAsteroid = (world: IWorld) => {
  const size = Phaser.Math.Between(MIN_ASTEROID_SIZE, MAX_ASTEROID_SIZE);
  return createAsteroid(world, 0, 0, size);
};
