import { createGameWorld, GameWorld } from 'shared/src/ecs/world';
import { SimMessage, SimMessageType, SimResult } from './types';
import { addComponent, addEntity, entityExists, removeEntity } from 'bitecs';
import {
  Active,
  AffectedByGravity,
  Collision,
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
  createPathTrackerSystem,
} from 'shared/src/ecs/systems';
import { TargetCache, TurnInput } from 'shared/src/types';
import { buildColliderCache, inputsToShot } from '../functions';
import { getPosition, getRadius } from 'shared/src/utils';
import { restoreSnapshot } from './snapshot';

type Updater = (world: GameWorld, time: number, delta: number) => void;

const MAX_MS = 10000;
const MS_STEP = 80;
const MIN_MS_STEP = 10;
const DYNAMIC_DECREASE_RADIUS_MULTIPLIER = 5;

const stepVariance = MS_STEP - MIN_MS_STEP;

const world = createGameWorld();

let cloneMap = new Map<number, number>();
let colliders: TargetCache = [];
let updater: Updater = () => {};

self.onmessage = (ev: MessageEvent<SimMessage>) => {
  const { type, snapshot, turnInput } = ev.data;

  switch (type) {
    case SimMessageType.INITIALIZE:
      cloneMap = restoreSnapshot(snapshot!, world);
      colliders = buildColliderCache(world);
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

  let dynamicStep = MS_STEP;
  const ownRad = getRadius(turnInfo.playerId);
  const minBuffer = Math.pow(ownRad * DYNAMIC_DECREASE_RADIUS_MULTIPLIER, 2);
  // console.log('min buffer at', minBuffer);
  const proj = fireProjectile(turnInfo);
  let numSteps = 0;

  for (let t = 0; t < MAX_MS; t += dynamicStep) {
    // console.log('stepping at', dynamicStep);
    numSteps++;
    let stepClosestd2 = Infinity;

    updateSystems(world, t, dynamicStep);

    // A system may have removed / cleaned up the projectile
    if (!entityExists(world, proj)) break;

    // Track closest approach to any destructible
    for (const trg of targets) {
      const { x: x1, y: y1 } = getPosition(proj);
      const r1 = getRadius(proj);
      const { x: x2, y: y2 } = trg;
      const r2 = getRadius(trg.eid);

      const dx = x2 - x1;
      const dy = y2 - y1;
      const d2 = dx * dx + dy * dy;
      const radSum = r1 + r2;
      const hasOverlap = d2 < radSum * radSum;

      if (hasOverlap) {
        if (trg.breaks) {
          console.log('sim %s: found target in %s steps', playerId, numSteps);
          hitEid = trg.eid;
        } else {
          firstCollisionEid = trg.eid;
          firstCollisionT = t;
        }
        break;
      }
      if (d2 < stepClosestd2) {
        stepClosestd2 = d2;
      }
      if (trg.breaks && d2 < closestDist2) {
        closestDist2 = d2;
        closestEid = trg.eid;
      }
    }

    if (hitEid || firstCollisionEid) {
      removeEntity(world, proj);
      break;
    }

    // console.log(
    //   'sim for %s: need %s, closest %s',
    //   playerId,
    //   Math.floor(ownRad * ownRad),
    //   stepClosestd2,
    // );

    if (stepClosestd2 < minBuffer) {
      dynamicStep = MIN_MS_STEP + (stepClosestd2 / minBuffer) * stepVariance;
    } else {
      dynamicStep = MS_STEP;
    }
  }
  const shotTrail =
    (world.movements && [...world.movements[playerId].movementTrace]) || [];

  world.movements = null;
  const input = {
    angle: turnInfo.angle,
    power: turnInfo.power,
  };

  const result = {
    didHit: hitEid > 0,
    hitEid,
    shotTrail,
    closestEid,
    closestDist2,
    input,
    firstCollisionEid,
    firstCollisionT,
  };

  // console.log(
  //   'sim for player %s (%s): didHit %s, hitEid %s, closestEid %s, firstCollisionEid %s',
  //   colNames[playerId - 1],
  //   playerId,
  //   hitEid > 0,
  //   hitEid,
  //   closestEid,
  //   firstCollisionEid,
  // );

  return result;
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
  addComponent(world, Active, proj);

  Collision.radius[proj] = 2;
  Projectile.parent[proj] = input.playerId;
  HasLifetime.createdAt[proj] = 0;
  inputsToShot(playerId, proj, input);
  return proj;
};

// Create and set up systems, return an updater function that updates all of them at once
const setupSystems = () => {
  const movementSystem = createMovementSystem();
  const pathTrackerSystem = createPathTrackerSystem();
  const gravitySystem = createGravitySystem();
  const collisionSystem = createCollisionSystem();
  const collisionResolverSystem = createCollisionResolverSystem(() => {
    return false;
  });
  const cleanupSystem = createCleanupSystem((eid) => removeEntity(world, eid));

  return (world: GameWorld, time: number, delta: number) => {
    world.time = time;
    world.delta = delta;
    movementSystem(world);
    pathTrackerSystem(world);
    gravitySystem(world);
    collisionSystem(world);
    collisionResolverSystem(world);
    cleanupSystem(world);
  };
};
