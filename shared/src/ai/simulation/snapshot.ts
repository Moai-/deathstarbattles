import {
  Active,
  AffectedByGravity,
  AffectedByJets,
  Collision,
  Destructible,
  HasGravity,
  HasLifetime,
  HasPolarJets,
  ObjectInfo,
  Position,
  Projectile,
  Velocity,
  Wormhole,
} from 'shared/src/ecs/components';
import { ComponentTags, SimSnapshot } from './types';
import { addComponent, addEntity, hasComponent, ComponentRef } from 'bitecs';
import { GameWorld } from 'shared/src/ecs/world';
import { ENTITY_START_CURSOR } from 'shared/src/consts';

export const sysComponents = [
  Active,
  AffectedByGravity,
  AffectedByJets,
  Collision,
  Destructible,
  HasGravity,
  HasLifetime,
  HasPolarJets,
  ObjectInfo,
  Position,
  Projectile,
  Velocity,
  Wormhole,
]

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

    // Jets
    jetStrength: new Float32Array(n),
    innerRadius: new Float32Array(n),
    rotation: new Float32Array(n),
    length: new Float32Array(n),
    _tanHalfSpread: new Float32Array(n),
    _prevRotation: new Float32Array(n),
    _prevSpread: new Float32Array(n),
    spreadRad: new Float32Array(n),
    _dirX: new Float32Array(n),
    _dirY: new Float32Array(n),
    _perpX: new Float32Array(n),
    _perpY: new Float32Array(n),
    corePow: new Float32Array(n),
    endFadeFrac: new Float32Array(n), 
    outerFadeBias: new Float32Array(n),
    deflectAngleRad: new Float32Array(n),
  };

  const has = (component: ComponentRef, eid: number) =>
    hasComponent(world, eid, component) ? 1 : 0;

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
      (has(Active, src)             ? ComponentTags.Active            : 0) | // eslint-disable-line
      (has(Wormhole, src)           ? ComponentTags.Wormhole          : 0) | // eslint-disable-line
      (has(AffectedByJets, src)     ? ComponentTags.AffectedByJets    : 0) | // eslint-disable-line
      (has(HasPolarJets, src)       ? ComponentTags.HasPolarJets      : 0);  // eslint-disable-line

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

    snap.jetStrength[i] = HasPolarJets.jetStrength[src];
    snap.innerRadius[i] = HasPolarJets.innerRadius[src];
    snap.length[i] = HasPolarJets.length[src];
    snap._tanHalfSpread[i] = HasPolarJets._tanHalfSpread[src];
    snap.spreadRad[i] = HasPolarJets.spreadRad[src];
    snap._dirX[i] = HasPolarJets._dirX[src];
    snap._dirY[i] = HasPolarJets._dirY[src];
    snap._perpX[i] = HasPolarJets._perpX[src];
    snap._perpY[i] = HasPolarJets._perpY[src];
    snap.corePow[i] = HasPolarJets.corePow[src];
    snap.endFadeFrac[i] = HasPolarJets.endFadeFrac[src];
    snap.outerFadeBias[i] = HasPolarJets.outerFadeBias[src];
    snap.deflectAngleRad[i] = HasPolarJets.deflectAngleRad[src];
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

  s.jetStrength.buffer,
  s.innerRadius.buffer,
  s.length.buffer,
  s._tanHalfSpread.buffer,
  s.spreadRad.buffer,
  s._dirX.buffer,
  s._dirY.buffer,
  s._perpX.buffer,
  s._perpY.buffer,
  s.corePow.buffer,
  s.endFadeFrac.buffer,
  s.outerFadeBias.buffer,
  s.deflectAngleRad.buffer,
];

// With a world snapshot as input, restore all entities within it and populate them.
// In bitecs 0.4 the worker world may already have entities (e.g. NULL_ENTITY reserve),
// so we add entities first and then bulk-set data to the actual cloned eids.
export const restoreSnapshot = (snapshot: SimSnapshot, world: GameWorld) => {
  const cloneMap = new Map<number, number>();

  const n = snapshot.count;

  // 1. Add entities and components first so cloned eids match addEntity() return order.
  for (let i = 0; i < n; i++) {
    const eid = snapshot.eid[i];
    const clonedEid = addEntity(world);
    cloneMap.set(eid, clonedEid);

    addComponent(world, clonedEid, ObjectInfo);
    ObjectInfo.type[clonedEid] = snapshot.type[i];
    ObjectInfo.cloneOf[clonedEid] = eid;

    const tag = snapshot.componentTags[i];

    if (tag & ComponentTags.AffectedByGravity) {
      addComponent(world, clonedEid, AffectedByGravity);
    }

    if (tag & ComponentTags.Destructible) {
      addComponent(world, clonedEid, Destructible);
    }

    if (tag & ComponentTags.Collision) {
      addComponent(world, clonedEid, Collision);
    }

    if (tag & ComponentTags.HasGravity) {
      addComponent(world, clonedEid, HasGravity);
    }

    if (tag & ComponentTags.HasLifetime) {
      addComponent(world, clonedEid, HasLifetime);
    }

    if (tag & ComponentTags.Position) {
      addComponent(world, clonedEid, Position);
    }

    if (tag & ComponentTags.Projectile) {
      addComponent(world, clonedEid, Projectile);
    }

    if (tag & ComponentTags.Velocity) {
      addComponent(world, clonedEid, Velocity);
    }

    if (tag & ComponentTags.Wormhole) {
      addComponent(world, clonedEid, Wormhole);
    }

    if (tag & ComponentTags.Active) {
      addComponent(world, clonedEid, Active);
    }

    if (tag & ComponentTags.HasPolarJets) {
      addComponent(world, clonedEid, HasPolarJets);
    }

    if (tag & ComponentTags.AffectedByJets) {
      addComponent(world, clonedEid, AffectedByJets);
    }
  }

  // 2. Bulk-set component data to the first cloned eid (not ENTITY_START_CURSOR, which may be already used).
  const startEid = n > 0 ? cloneMap.get(snapshot.eid[0])! : ENTITY_START_CURSOR;

  Collision.radius.set(snapshot.radius.subarray(0, n), startEid);
  HasGravity.strength.set(
    snapshot.strength.subarray(0, n),
    startEid,
  );
  HasGravity.falloffType.set(
    snapshot.falloffType.subarray(0, n),
    startEid,
  );
  HasLifetime.createdAt.set(
    snapshot.createdAt.subarray(0, n),
    startEid,
  );
  Position.x.set(snapshot.posX.subarray(0, n), startEid);
  Position.y.set(snapshot.posY.subarray(0, n), startEid);
  Velocity.x.set(snapshot.velX.subarray(0, n), startEid);
  Velocity.y.set(snapshot.velY.subarray(0, n), startEid);
  Wormhole.exitType.set(snapshot.exitType.subarray(0, n), startEid);

  HasPolarJets.jetStrength.set(snapshot.jetStrength.subarray(0, n), startEid);
  HasPolarJets.innerRadius.set(snapshot.innerRadius.subarray(0, n), startEid);
  HasPolarJets.length.set(snapshot.length.subarray(0, n), startEid);
  HasPolarJets._tanHalfSpread.set(snapshot._tanHalfSpread.subarray(0, n), startEid);
  HasPolarJets.spreadRad.set(snapshot.spreadRad.subarray(0, n), startEid);
  HasPolarJets._dirX.set(snapshot._dirX.subarray(0, n), startEid);
  HasPolarJets._dirY.set(snapshot._dirY.subarray(0, n), startEid);
  HasPolarJets._perpX.set(snapshot._perpX.subarray(0, n), startEid);
  HasPolarJets._perpY.set(snapshot._perpY.subarray(0, n), startEid);
  HasPolarJets.corePow.set(snapshot.corePow.subarray(0, n), startEid);
  HasPolarJets.endFadeFrac.set(snapshot.endFadeFrac.subarray(0, n), startEid);
  HasPolarJets.outerFadeBias.set(snapshot.outerFadeBias.subarray(0, n), startEid);
  HasPolarJets.deflectAngleRad.set(snapshot.deflectAngleRad.subarray(0, n), startEid);

  // 3. Remap entity references (original eids -> cloned eids) for parent, lastCollisionTarget, teleportTarget.
  for (let i = 0; i < n; i++) {
    const clonedEid = cloneMap.get(snapshot.eid[i])!;
    Projectile.parent[clonedEid] = cloneMap.get(snapshot.parent[i]) ?? 0;
    Projectile.lastCollisionTarget[clonedEid] =
      cloneMap.get(snapshot.lastCollisionTarget[i]) ?? 0;
    Wormhole.teleportTarget[clonedEid] =
      cloneMap.get(snapshot.teleportTarget[i]) ?? 0;
  }

  return cloneMap;
};
