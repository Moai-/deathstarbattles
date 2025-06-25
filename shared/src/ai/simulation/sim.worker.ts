import { createGameWorld, GameWorld } from 'shared/src/ecs/world';
import {
  ComponentTags,
  SimMessage,
  SimMessageType,
  SimResult,
  SimSnapshot,
} from './types';
import {
  addComponent,
  addEntity,
  entityExists,
  hasComponent,
  removeEntity,
} from 'bitecs';
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
import {
  createBaseCleanupSystem,
  createBaseCollisionResolverSystem,
  createBaseCollisionSystem,
  createBaseGravitySystem,
  createBaseMovementSystem,
} from 'shared/src/ecs/systems';
import { TargetCache, TurnInput } from 'shared/src/types';
import { inputsToShot } from '../functions';
import { getColliders, getRadius } from 'shared/src/utils';

type Updater = (world: GameWorld, time: number, delta: number) => void;

const MAX_MS = 10000;
const MS_STEP = 80;
const ENTITY_START_CURSOR = 1;

const world = createGameWorld();

let cloneMap = new Map<number, number>();
let colliders: TargetCache = [];
let updater: Updater = () => {};

self.onmessage = (ev: MessageEvent<SimMessage>) => {
  const { type, snapshot, turnInput } = ev.data;

  switch (type) {
    case SimMessageType.INITIALIZE:
      cloneMap = restoreSnapshot(snapshot!);
      colliders = buildColliderCache();
      updater = setupSystems();
      self.postMessage({ type: SimMessageType.INITIALIZE_DONE });
      break;
    case SimMessageType.SIMULATE: {
      const ipt = {
        ...turnInput!,
        playerId: cloneMap.get(turnInput!.playerId)!,
      };
      const simRes = runSimulation(ipt, colliders, updater);
      const result = {
        ...simRes,
        hitEid: ObjectInfo.cloneOf[simRes.hitEid],
        closestEid: ObjectInfo.cloneOf[simRes.closestEid],
        firstCollisionEid: ObjectInfo.cloneOf[simRes.firstCollisionEid],
      };
      self.postMessage({ type: SimMessageType.SIMULATE_DONE, result });
      break;
    }
  }
};

self.postMessage({ type: SimMessageType.ACTIVE });

const runSimulation = (
  turnInfo: TurnInput,
  colliderCache: TargetCache,
  updateSystems: Updater,
): SimResult => {
  const { playerId } = turnInfo;

  const targets = colliderCache.filter((t) => t.eid !== playerId);

  let closestEid: number = 0;
  let closestDist2 = Infinity;
  let hitEid: number = 0;
  let firstCollisionEid = 0;
  let firstCollisionT = 0;

  const proj = fireProjectile(turnInfo);

  for (let t = 0; t < MAX_MS; t += MS_STEP) {
    updateSystems(world, t, MS_STEP);

    // A system may have removed / cleaned up the projectile
    if (!entityExists(world, proj)) break;

    // Track closest approach to any destructible
    for (const trg of targets) {
      const dx = Position.x[proj] - trg.x;
      const dy = Position.y[proj] - trg.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < trg.r2) {
        if (trg.breaks) {
          hitEid = trg.eid;
        } else {
          firstCollisionEid = trg.eid;
          firstCollisionT = t;
        }
        break;
      }
      if (trg.breaks && d2 < closestDist2) {
        closestDist2 = d2;
        closestEid = trg.eid;
      }
    }
    if (hitEid) {
      break;
    }
  }
  const shotTrail =
    (world.movements && [...world.movements[playerId].movementTrace]) || [];

  world.movements = null;
  const input = {
    angle: turnInfo.angle,
    power: turnInfo.power,
  };

  return {
    didHit: hitEid > 0,
    hitEid,
    shotTrail,
    closestEid,
    closestDist2,
    input,
    firstCollisionEid,
    firstCollisionT,
  };
};

// Spawn a projectile and fire it
const fireProjectile = (input: TurnInput) => {
  const proj = addEntity(world);
  const { playerId } = input;
  addComponent(world, Position, proj);
  addComponent(world, Velocity, proj);
  addComponent(world, Collision, proj);
  addComponent(world, Projectile, proj);
  addComponent(world, AffectedByGravity, proj);
  addComponent(world, HasLifetime, proj);

  Collision.radius[proj] = 2;
  Projectile.parent[proj] = input.playerId;
  HasLifetime.createdAt[proj] = 0;
  inputsToShot(playerId, proj, input);
  return proj;
};

export const buildColliderCache = (): TargetCache =>
  getColliders(world).map((o) => ({
    eid: o,
    breaks: hasComponent(world, Destructible, o),
    x: Position.x[o],
    y: Position.y[o],
    r2: Math.pow(getRadius(o), 2),
  }));

// With a world snapshot as input, restore all entities within it and populate them
const restoreSnapshot = (snapshot: SimSnapshot) => {
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

// Create and set up systems, return an updater function that updates all of them at once
const setupSystems = () => {
  const movementSystem = createBaseMovementSystem();
  const gravitySystem = createBaseGravitySystem();
  const collisionSystem = createBaseCollisionSystem();
  const collisionResolverSystem = createBaseCollisionResolverSystem((proj) => {
    removeEntity(world, proj);
    return false;
  });
  const cleanupSystem = createBaseCleanupSystem();

  return (world: GameWorld, time: number, delta: number) => {
    world.time = time;
    world.delta = delta;
    movementSystem(world);
    gravitySystem(world);
    collisionSystem(world);
    collisionResolverSystem(world);
    cleanupSystem(world);
  };
};
