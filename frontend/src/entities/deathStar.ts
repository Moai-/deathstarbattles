import { addComponent, addEntity } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Velocity } from 'shared/src/ecs/components/velocity';
import { Collision } from 'shared/src/ecs/components/collision';
import { AffectedByGravity } from 'shared/src/ecs/components/affectedByGravity';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { HasLifetime } from 'shared/src/ecs/components/hasLifetime';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { LeavesTrail, TrailType } from '../render/components/leavesTrail';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';
import { colToUi32 } from '../util/col';
import { GameWorld } from 'shared/src/ecs/world';

export const DEFAULT_DEATHSTAR_RADIUS = 17;
export const DEFAULT_DEATHBEAM_RADIUS = 2;

export const createDeathStar = (
  world: GameWorld,
  x: number,
  y: number,
  color: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Collision, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, Destructible, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS;
  Renderable.type[eid] = RenderableTypes.DEATHSTAR;
  Renderable.col[eid] = colToUi32(color);

  return eid;
};

export const fireProjectile = (
  world: GameWorld,
  parentEid: number,
  angle: number,
  speed: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, Collision, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, LeavesTrail, eid);
  addComponent(world, Projectile, eid);
  addComponent(world, AffectedByGravity, eid);
  addComponent(world, HasLifetime, eid);

  const angleRad = Phaser.Math.DegToRad(angle);
  const fasterSpeed = speed * 2;

  Projectile.parent[eid] = parentEid;
  Collision.radius[eid] = DEFAULT_DEATHBEAM_RADIUS;
  // slight offset to avoid triggering collision on firing
  const offset = Collision.radius[parentEid] + DEFAULT_DEATHBEAM_RADIUS;
  Position.x[eid] = Position.x[parentEid] + Math.cos(angleRad) * offset;
  Position.y[eid] = Position.y[parentEid] + Math.sin(angleRad) * offset;
  Velocity.x[eid] = Math.cos(angleRad) * fasterSpeed;
  Velocity.y[eid] = Math.sin(angleRad) * fasterSpeed;
  Renderable.type[eid] = RenderableTypes.DEATHBEAM;
  Renderable.col[eid] = Renderable.col[parentEid];
  LeavesTrail.col[eid] = Renderable.col[parentEid];
  LeavesTrail.type[eid] = TrailType.BEADS_ON_A_STRING;
  HasLifetime.createdAt[eid] = Math.floor(world.time);

  return eid;
};
