import { createGameWorld, GameWorld } from 'shared/src/ecs/world';
import { SimMessage, SimMessageType } from './types';
import {
  addComponent,
  addEntity,
  entityExists,
  hasComponent,
  removeEntity,
} from 'bitecs';
import {
  Active,
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
  createPathTrackerSystem,
  createPolarJetSystem,
} from 'shared/src/ecs/systems';
import { SimShotResult, TargetCache, TurnInput } from 'shared/src/types';
import {
  buildColliderCache,
  getSquaredDistance,
  inputsToShot,
} from '../functions';
import { getPosition, getRadius } from 'shared/src/utils';
import { restoreSnapshot } from './snapshot';

type Updater = (world: GameWorld, time: number, delta: number) => void;

const MAX_MS = 10000;
const MS_STEP = 1;

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
        hitsEid: ObjectInfo.cloneOf[simRes.hitsEid],
        closestDestructible: ObjectInfo.cloneOf[simRes.closestDestructible],
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
): SimShotResult => {
  const { playerId } = turnInfo;

  const targets = colliderCache.filter((t) => t.eid !== playerId);

  let closestDestructible = 0;
  let hitsEid = 0;
  let collisionT: number | null = null;

  let bestDist2 = Infinity;
  let closestPoint = { x: 0, y: 0 };

  // console.log('min buffer at', minBuffer);
  const proj = fireProjectile(turnInfo);
  // let numSteps = 0;
  // const start = Date.now();

  for (let t = 0; t < MAX_MS; t += MS_STEP) {
    // console.log('stepping at', dynamicStep);
    // numSteps++;
    let stepClosestd2 = Infinity;

    updateSystems(world, t, MS_STEP);

    // A system may have removed / cleaned up the projectile
    if (!entityExists(world, proj)) break;

    // Track closest approach to any colliding object
    for (const trg of targets) {
      const projPoint = getPosition(proj);
      const { x: x1, y: y1 } = projPoint;
      const r1 = getRadius(proj);
      const { x: x2, y: y2 } = trg;
      const r2 = getRadius(trg.eid);

      const dx = x2 - x1;
      const dy = y2 - y1;
      const d2 = dx * dx + dy * dy;
      const radSum = r1 + r2;
      const hasOverlap = d2 < radSum * radSum;

      if (hasOverlap) {
        hitsEid = trg.eid;
        collisionT = t;
        if (trg.breaks) {
          // console.log(
          //   'sim %s: found target in %s steps and %s ms',
          //   playerId,
          //   numSteps,
          //   Date.now() - start,
          // );
          closestDestructible = trg.eid;
        }
        break;
      }
      if (d2 < stepClosestd2) {
        stepClosestd2 = d2;
      }
      if (trg.breaks && d2 < bestDist2) {
        bestDist2 = d2;
        closestDestructible = trg.eid;
        closestPoint = projPoint;
      }
    }

    if (hitsEid) {
      removeEntity(world, proj);
      break;
    }

    // console.log(
    //   'sim for %s: need %s, closest %s',
    //   playerId,
    //   Math.floor(ownRad * ownRad),
    //   stepClosestd2,
    // );
  }
  const willHit = hitsEid === closestDestructible;
  if (!willHit) {
    // console.log(
    //   'sim %s: missed after %s steps and %s ms',
    //   playerId,
    //   numSteps,
    //   Date.now() - start,
    // );
  }
  const shotTrail =
    (world.movements && [...world.movements[playerId].movementTrace]) || [];

  world.movements = null;
  const input = {
    angle: turnInfo.angle,
    power: turnInfo.power,
  };

  const destructible = !!(
    hitsEid && hasComponent(world, hitsEid, Destructible)
  );

  return {
    hitsEid,
    hitsSelf: hitsEid === playerId,
    destructible,
    willHit,
    closestDestructible,
    closestPoint,
    closestDist2: bestDist2,
    shotDist2: getSquaredDistance(
      shotTrail[0],
      shotTrail[shotTrail.length - 1],
    ),

    collisionT,
    input,
    shotTrail,
  };
};

// Spawn a projectile and fire it
const fireProjectile = (input: TurnInput) => {
  const proj = addEntity(world);
  const { playerId } = input;
  addComponent(world, proj, Position);
  addComponent(world, proj, Velocity);
  addComponent(world, proj, Collision);
  addComponent(world, proj, Projectile);
  addComponent(world, proj, AffectedByGravity);
  addComponent(world, proj, HasLifetime);
  addComponent(world, proj, Active);

  Collision.radius[proj] = Collision.radius[input.playerId] / 8;
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
  const jetSystem = createPolarJetSystem();
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
    jetSystem(world);
    collisionSystem(world);
    collisionResolverSystem(world);
    cleanupSystem(world);
  };
};
