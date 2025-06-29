import { addComponent, addEntity, entityExists, removeComponent } from 'bitecs';
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
import { ObjectInfo } from 'shared/src/ecs/components/objectInfo';
import { DEFAULT_DEATHBEAM_RADIUS } from 'shared/src/consts';
import { inputsToShot } from 'shared/src/ai/functions';
import { Player } from 'shared/src/ecs/components/player';
import { Active } from 'shared/src/ecs/components';

export const DEFAULT_DEATHSTAR_RADIUS = 8;

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
  addComponent(world, ObjectInfo, eid);
  addComponent(world, Player, eid);
  addComponent(world, Active, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS;
  ObjectInfo.type[eid] = ObjectTypes.DEATHSTAR;
  Renderable.col[eid] = colToUi32(color);

  const projEid = addEntity(world);
  addComponent(world, Position, projEid);
  addComponent(world, Velocity, projEid);
  addComponent(world, Collision, projEid);
  addComponent(world, Renderable, projEid);
  addComponent(world, LeavesTrail, projEid);
  addComponent(world, Projectile, projEid);
  addComponent(world, AffectedByGravity, projEid);
  addComponent(world, HasLifetime, projEid);
  addComponent(world, ObjectInfo, projEid);

  Player.pooledProjectile[eid] = projEid;
  Projectile.parent[projEid] = eid;
  Projectile.lastCollisionTarget[projEid] = NULL_ENTITY;
  Collision.radius[projEid] = DEFAULT_DEATHBEAM_RADIUS;
  ObjectInfo.type[projEid] = ObjectTypes.DEATHBEAM;
  ObjectInfo.type[projEid] = ObjectTypes.DEATHBEAM;
  Renderable.col[projEid] = Renderable.col[eid];
  LeavesTrail.col[projEid] = Renderable.col[eid];
  LeavesTrail.type[projEid] = TrailType.BEADS_ON_A_STRING;
  return eid;
};

export const fireProjectile = (
  world: GameWorld,
  parentEid: number,
  angle: number,
  power: number,
) => {
  const eid = Player.pooledProjectile[parentEid];
  HasLifetime.createdAt[eid] = Math.floor(world.time);
  Projectile.lastCollisionTarget[eid] = NULL_ENTITY;
  Collision.radius[eid] = Collision.radius[parentEid] / 8;
  addComponent(world, Active, eid);

  inputsToShot(parentEid, eid, { angle, power });

  return eid;
};

export const removeProjectile = (
  removeProp: {
    parentEid?: number;
    projEid?: number;
  },
  world: GameWorld,
) => {
  const { parentEid, projEid } = removeProp;

  const eid = parentEid ? Player.pooledProjectile[parentEid] : projEid!;
  if (!entityExists(world, eid)) {
    return;
  }
  HasLifetime.createdAt[eid] = 0;
  removeComponent(world, Active, eid);
};
