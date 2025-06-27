import { defineQuery } from 'bitecs';
import { Collision } from '../ecs/components/collision';
import { ObjectInfo } from '../ecs/components/objectInfo';
import { Position } from '../ecs/components/position';
import { Projectile } from '../ecs/components/projectile';
import { ExitTypes, Wormhole } from '../ecs/components/wormhole';
import { GameWorld } from '../ecs/world';
import { AnyPoint, GameObject, ObjectTypes } from '../types';
import { Active, Destructible } from '../ecs/components';

export const getRadius = (eid: number) => Collision.radius[eid];

export const getPosition = (eid: number) => ({
  x: Position.x[eid],
  y: Position.y[eid],
});

export const setPosition = (eid: number, x: number | AnyPoint, y?: number) => {
  if (typeof (x as AnyPoint).x !== 'undefined') {
    const pt = x as AnyPoint;
    Position.x[eid] = pt.x;
    Position.y[eid] = pt.y;
  } else {
    Position.x[eid] = x as number;
    Position.y[eid] = y!;
  }
};

export const getType = (eid: number) => ObjectInfo.type[eid] as ObjectTypes;

export const getProjectileOwner = (eid: number) => Projectile.parent[eid];

export const pairWormholes = (eid1: number, eid2: number) => {
  const pairType =
    getType(eid1) === ObjectTypes.BIG_WORMHOLE
      ? ExitTypes.PAIRED_GIANT
      : ExitTypes.PAIRED;
  Wormhole.exitType[eid1] = pairType;
  Wormhole.exitType[eid2] = pairType;
  Wormhole.teleportTarget[eid1] = eid2;
  Wormhole.teleportTarget[eid2] = eid1;
};

export const scrambleWormhole = (eid: number) => {
  Wormhole.exitType[eid] = ExitTypes.RANDOM;
  Wormhole.teleportTarget[eid] = 0;
};

const colliderQuery = defineQuery([Collision, Position, Active]);
export const getColliders = (world: GameWorld) => colliderQuery(world);

const targetQuery = defineQuery([Collision, Position, Destructible, Active]);
export const getTargets = (world: GameWorld) => targetQuery(world);

export const getAllObjects: (world: GameWorld) => Array<GameObject> = (world) =>
  getColliders(world).map((eid) => ({
    x: Position.x[eid],
    y: Position.y[eid],
    radius: Collision.radius[eid],
    eid,
  }));
