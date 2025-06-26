import { createGameWorld, GameWorld } from 'shared/src/ecs/world';
import { SimMessage, SimMessageType, SimResult } from './types';
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
  HasLifetime,
  ObjectInfo,
  Position,
  Projectile,
  Velocity,
} from 'shared/src/ecs/components';
import {
  createCleanupSystem,
  createCollisionResolverSystem,
  createCollisionSystem,
  createGravitySystem,
  createMovementSystem,
} from 'shared/src/ecs/systems';
import { TargetCache, TurnInput } from 'shared/src/types';
import { inputsToShot } from '../functions';
import { getColliders, getRadius } from 'shared/src/utils';
import { restoreSnapshot } from './snapshot';

type Updater = (world: GameWorld, time: number, delta: number) => void;

const MAX_MS = 10000;
const MS_STEP = 80;

const world = createGameWorld();

let cloneMap = new Map<number, number>();
let colliders: TargetCache = [];
let updater: Updater = () => {};

self.onmessage = (ev: MessageEvent<SimMessage>) => {
  const { type, snapshot, turnInput } = ev.data;

  switch (type) {
    case SimMessageType.INITIALIZE:
      cloneMap = restoreSnapshot(snapshot!, world);
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
  Projectile.active[proj] = 1;
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

// Create and set up systems, return an updater function that updates all of them at once
const setupSystems = () => {
  const movementSystem = createMovementSystem();
  const gravitySystem = createGravitySystem();
  const collisionSystem = createCollisionSystem();
  const collisionResolverSystem = createCollisionResolverSystem((proj) => {
    removeEntity(world, proj);
    return false;
  });
  const cleanupSystem = createCleanupSystem((eid) => removeEntity(world, eid));

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
