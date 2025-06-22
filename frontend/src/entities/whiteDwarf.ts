import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';

const MIN_STAR_RAD = 6;
const MAX_STAR_RAD = 12;

export const createWhiteDwarf = (
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
  HasGravity.strength[eid] = (radius + 20) * 1500;
  Renderable.type[eid] = RenderableTypes.WHITE_DWARF;
  Renderable.col[eid] = generateRandomStarCol();

  return eid;
};

export const createRandomWhiteDwarf = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createWhiteDwarf(world, 0, 0, radius);
};

export const generateRandomStarCol = () => {
  const r = 230 + Math.floor(Math.random() * 25);
  const g = 230 + Math.floor(Math.random() * 25);
  const b = 230 + Math.floor(Math.random() * 25);

  return (r << 16) | (g << 8) | b;
};
