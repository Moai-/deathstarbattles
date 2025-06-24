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
import { GameWorld, NULL_ENTITY } from 'shared/src/ecs/world';
import { ObjectTypes } from 'shared/src/types';
import { colToUi32 } from 'shared/src/utils';
import { ObjType } from 'shared/src/ecs/components/objType';
import { DEFAULT_DEATHBEAM_RADIUS } from 'shared/src/consts';
import { inputsToShot } from 'shared/src/ai/functions';

export const DEFAULT_DEATHSTAR_RADIUS = 17;

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
  addComponent(world, ObjType, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS;
  ObjType.type[eid] = ObjectTypes.DEATHSTAR;
  Renderable.col[eid] = colToUi32(color);

  return eid;
};

export const fireProjectile = (
  world: GameWorld,
  parentEid: number,
  angle: number,
  power: number,
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
  addComponent(world, ObjType, eid);

  Projectile.parent[eid] = parentEid;
  Projectile.lastCollisionTarget[eid] = NULL_ENTITY;
  Collision.radius[eid] = DEFAULT_DEATHBEAM_RADIUS;
  inputsToShot(parentEid, eid, { angle, power });
  ObjType.type[eid] = ObjectTypes.DEATHBEAM;
  Renderable.col[eid] = Renderable.col[parentEid];
  LeavesTrail.col[eid] = Renderable.col[parentEid];
  LeavesTrail.type[eid] = TrailType.BEADS_ON_A_STRING;
  HasLifetime.createdAt[eid] = Math.floor(world.time);

  return eid;
};
