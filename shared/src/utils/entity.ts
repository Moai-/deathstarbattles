import { ComponentRef, query } from 'bitecs';
import { GameWorld } from '../ecs/world';
import { AnyPoint, GameObject, ObjectTypes } from '../types';
import { Active, Collision, Destructible, HyperLocus, ObjectInfo, Position, Projectile, Wormhole } from '../ecs/components';
import { ExitTypes } from '../ecs/components/wormhole';

export const collidingEntities: Array<ComponentRef> = [];
export const targetEntities: Array<ComponentRef> = [];
export const locusEntities: Array<ComponentRef> = [];

const setUpQueries = () => {
  collidingEntities.push(Collision, Position, Active);
  targetEntities.push(Collision, Position, Destructible, ObjectInfo, Active);
  locusEntities.push(HyperLocus, Active);
}

export const getRadius = (eid: number) => Collision.radius[eid];

export const getPosition = (eid: number) => ({
  x: Position.x[eid],
  y: Position.y[eid],
});

export const getGameObject = (eid: number) => ({
  ...getPosition(eid),
  radius: getRadius(eid),
  eid,
}) as GameObject;

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

export const getColliders = (world: GameWorld) => query(world, collidingEntities) as Array<number>;
export const getTargets = (world: GameWorld, self: number) => 
  (query(world, targetEntities) as Array<number>)
  .filter((eid) => ObjectInfo.owner[eid] !== ObjectInfo.owner[self]);

export const getAllObjects: (world: GameWorld) => Array<GameObject> = (world: GameWorld) => {
  const colliders = getColliders(world) ;
  return colliders.map((eid) => ({
    x: Position.x[eid],
    y: Position.y[eid],
    radius: Collision.radius[eid],
    eid,
  }))
}

export const getHyperLocus = (world: GameWorld) => {
  const [locus] = query(world, locusEntities);
  if (locus) {
    return locus;
  }
  return null;
};

queueMicrotask(() => {
  setUpQueries();
})