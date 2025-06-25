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
import { Component, hasComponent } from 'bitecs';
import { GameWorld } from 'shared/src/ecs/world';

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

  s.velX.buffer,
  s.velY.buffer,

  s.teleportTarget.buffer,
  s.exitType.buffer,
];

// const eids = gatherBodies(projectileEid); // your query
// const snapshot = buildSnapshot(eids);

// worker.postMessage(snapshot, buffersOf(snapshot));
