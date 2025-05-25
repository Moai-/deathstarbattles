import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';

export const MIN_STAR_RAD = 70;
export const MAX_STAR_RAD = 230;

export const createJovian = (
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
  HasGravity.strength[eid] = radius * 50;
  Renderable.type[eid] = RenderableTypes.JOVIAN;
  Renderable.col[eid] = generateRandomJovianCol();

  return eid;
};

export const createRandomJovian = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createJovian(world, 0, 0, radius);
};

const generateRandomJovianCol = () => {
  const r = 140 + Math.floor(Math.random() * 111);
  const g = Math.floor(Math.random() * 121);
  const b = Math.floor(Math.random() * 51);

  return (r << 16) | (g << 8) | b;
};
