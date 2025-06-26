import {
  AffectedByGravity,
  Collision,
  Destructible,
  HasGravity,
  HasLifetime,
  ObjectInfo,
  Position,
  Projectile,
  Velocity,
  Wormhole,
} from 'shared/src/ecs/components';
import { ComponentTags, SimSnapshot } from './types';
import { addComponent, addEntity, Component, hasComponent } from 'bitecs';
import { GameWorld } from 'shared/src/ecs/world';
import { ENTITY_START_CURSOR } from 'shared/src/consts';

export const buildSnapshot = (
  eids: Array<number>,
  world: GameWorld,
): SimSnapshot => {
  const n = eids.length;

  const snap: SimSnapshot = {
    count: n,

    eid: new Uint32Array(n),

    // Non-data components
    componentTags: new Uint32Array(n),

    // Collision
    radius: new Uint16Array(n),

    // HasGravity
    strength: new Float32Array(n),
    falloffType: new Uint8Array(n),

    // HasLifetime
    createdAt: new Uint32Array(n),

    // ObjectInfo
    type: new Uint8Array(n),

    // Position
    posX: new Float32Array(n),
    posY: new Float32Array(n),

    // Projectile
    parent: new Uint32Array(n),
    lastCollisionTarget: new Uint32Array(n),
    active: new Uint8Array(n),

    // Velocity
    velX: new Float32Array(n),
    velY: new Float32Array(n),

    // Wormhole
    teleportTarget: new Uint32Array(n),
    exitType: new Uint8Array(n),
  };

  const has = (component: Component, eid: number) =>
    hasComponent(world, component, eid) ? 1 : 0;

  eids.forEach((src, i) => {
    snap.eid[i] = src;

    snap.componentTags[i] =
      (has(Position, src)           ? ComponentTags.Position          : 0) | // eslint-disable-line
      (has(Velocity, src)           ? ComponentTags.Velocity          : 0) | // eslint-disable-line
      (has(Collision, src)          ? ComponentTags.Collision         : 0) | // eslint-disable-line
      (has(HasGravity, src)         ? ComponentTags.HasGravity        : 0) | // eslint-disable-line
      (has(HasLifetime, src)        ? ComponentTags.HasLifetime       : 0) | // eslint-disable-line
      (has(AffectedByGravity, src)  ? ComponentTags.AffectedByGravity : 0) | // eslint-disable-line
      (has(Destructible, src)       ? ComponentTags.Destructible      : 0) | // eslint-disable-line
      (has(Projectile, src)         ? ComponentTags.Projectile        : 0) | // eslint-disable-line
      (has(Wormhole, src)           ? ComponentTags.Wormhole          : 0);  // eslint-disable-line

    snap.radius[i] = Collision.radius[src];

    snap.strength[i] = HasGravity.strength[src];
    snap.falloffType[i] = HasGravity.falloffType[src];

    snap.createdAt[i] = HasLifetime.createdAt[src];

    snap.type[i] = ObjectInfo.type[src];

    snap.posX[i] = Position.x[src];
    snap.posY[i] = Position.y[src];

    snap.parent[i] = Projectile.parent[src];
    snap.lastCollisionTarget[i] = Projectile.lastCollisionTarget[src];

    snap.velX[i] = Velocity.x[src];
    snap.velY[i] = Velocity.y[src];

    snap.teleportTarget[i] = Wormhole.teleportTarget[src];
    snap.exitType[i] = Wormhole.exitType[src];
  });

  return snap;
};

export const buffersOf = (s: SimSnapshot) => [
  s.eid.buffer,

  s.componentTags.buffer,

  s.radius.buffer,

  s.strength.buffer,
  s.falloffType.buffer,

  s.createdAt.buffer,

  s.type.buffer,

  s.posX.buffer,
  s.posY.buffer,

  s.parent.buffer,
  s.lastCollisionTarget.buffer,
  s.active.buffer,

  s.velX.buffer,
  s.velY.buffer,

  s.teleportTarget.buffer,
  s.exitType.buffer,
];

// With a world snapshot as input, restore all entities within it and populate them
export const restoreSnapshot = (snapshot: SimSnapshot, world: GameWorld) => {
  const cloneMap = new Map<number, number>();

  const n = snapshot.count;

  Collision.radius.set(snapshot.radius.subarray(0, n), ENTITY_START_CURSOR);
  HasGravity.strength.set(
    snapshot.strength.subarray(0, n),
    ENTITY_START_CURSOR,
  );
  HasGravity.falloffType.set(
    snapshot.falloffType.subarray(0, n),
    ENTITY_START_CURSOR,
  );
  HasLifetime.createdAt.set(
    snapshot.createdAt.subarray(0, n),
    ENTITY_START_CURSOR,
  );
  Position.x.set(snapshot.posX.subarray(0, n), ENTITY_START_CURSOR);
  Position.y.set(snapshot.posY.subarray(0, n), ENTITY_START_CURSOR);
  Projectile.parent.set(snapshot.parent.subarray(0, n), ENTITY_START_CURSOR);
  Projectile.active.set(snapshot.active.subarray(0, n), ENTITY_START_CURSOR);
  Projectile.lastCollisionTarget.set(
    snapshot.lastCollisionTarget.subarray(0, n),
    ENTITY_START_CURSOR,
  );
  Velocity.x.set(snapshot.velX.subarray(0, n), ENTITY_START_CURSOR);
  Velocity.y.set(snapshot.velY.subarray(0, n), ENTITY_START_CURSOR);
  Wormhole.teleportTarget.set(
    snapshot.teleportTarget.subarray(0, n),
    ENTITY_START_CURSOR,
  );
  Wormhole.exitType.set(snapshot.exitType.subarray(0, n), ENTITY_START_CURSOR);

  for (let i = 0; i < n; i++) {
    const eid = snapshot.eid[i];
    const clonedEid = addEntity(world);
    cloneMap.set(eid, clonedEid);

    addComponent(world, ObjectInfo, clonedEid);
    ObjectInfo.type[clonedEid] = snapshot.type[i];
    ObjectInfo.cloneOf[clonedEid] = eid;

    const tag = snapshot.componentTags[i];

    if (tag & ComponentTags.AffectedByGravity) {
      addComponent(world, AffectedByGravity, clonedEid);
    }

    if (tag & ComponentTags.Destructible) {
      addComponent(world, Destructible, clonedEid);
    }

    if (tag & ComponentTags.Collision) {
      addComponent(world, Collision, clonedEid);
    }

    if (tag & ComponentTags.HasGravity) {
      addComponent(world, HasGravity, clonedEid);
    }

    if (tag & ComponentTags.HasLifetime) {
      addComponent(world, HasLifetime, clonedEid);
    }

    if (tag & ComponentTags.Position) {
      addComponent(world, Position, clonedEid);
    }

    if (tag & ComponentTags.Projectile) {
      addComponent(world, Projectile, clonedEid);
    }

    if (tag & ComponentTags.Velocity) {
      addComponent(world, Velocity, clonedEid);
    }

    if (tag & ComponentTags.Wormhole) {
      addComponent(world, Wormhole, clonedEid);
    }
  }

  return cloneMap;
};
