import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';

const MIN_STAR_RAD = 250;
const MAX_STAR_RAD = 350;

export const createStar = (
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
  Renderable.type[eid] = RenderableTypes.STAR;
  Renderable.col[eid] = generateRedCol();

  return eid;
};

export const createRandomRedGiant = (world: IWorld) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createStar(world, 0, 0, radius);
};

export const generateRedCol = () => {
  const r = 230 + Math.floor(Math.random() * 25);
  const g = 70 + Math.floor(Math.random() * 10);
  const b = 40 + Math.floor(Math.random() * 10);

  return (r << 16) | (g << 8) | b;
};
