import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Velocity } from 'shared/src/ecs/components/velocity';
import { AffectedByGravity } from 'shared/src/ecs/components/affectedByGravity';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { LeavesTrail } from '../render/components/leavesTrail';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';
import { colToUi32 } from '../util/col';

export const createDeathStar = (
  world: IWorld,
  x: number,
  y: number,
  color: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Renderable, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Renderable.type[eid] = RenderableTypes.DEATHSTAR;
  Renderable.col[eid] = colToUi32(color);

  return eid;
};

export const fireProjectile = (
  world: IWorld,
  parentEid: number,
  angle: number,
  speed: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, LeavesTrail, eid);
  addComponent(world, Projectile, eid);
  addComponent(world, AffectedByGravity, eid);

  Projectile.parent[eid] = parentEid;
  Position.x[eid] = Position.x[parentEid];
  Position.y[eid] = Position.y[parentEid];
  Velocity.x[eid] = Math.cos(angle) * speed;
  Velocity.y[eid] = Math.sin(angle) * speed;
  Renderable.type[eid] = RenderableTypes.DEATHBEAM;
  Renderable.col[eid] = Renderable.col[parentEid];
  LeavesTrail.col[eid] = Renderable.col[parentEid];

  return eid;
};
