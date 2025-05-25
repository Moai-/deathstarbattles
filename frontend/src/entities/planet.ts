import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';

export const MIN_PLANET_RAD = 30;
export const MAX_PLANET_RAD = 70;

export const createAsteroid = (
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
  Renderable.type[eid] = RenderableTypes.PLANET;
  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = radius * 30;

  return eid;
};

export const createRandomPlanet = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_PLANET_RAD, MAX_PLANET_RAD);
  return createAsteroid(world, 0, 0, radius);
};
