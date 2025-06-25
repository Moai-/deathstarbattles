import {
  addEntity,
  addComponent,
  entityExists,
  hasComponent,
  removeEntity,
} from 'bitecs';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasLifetime } from 'shared/src/ecs/components/hasLifetime';
import { Position } from 'shared/src/ecs/components/position';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { Velocity } from 'shared/src/ecs/components/velocity';
import { createCleanupSystem } from 'shared/src/ecs/systems/cleanup';
import { createCollisionSystem } from 'shared/src/ecs/systems/collision';
import { createGravitySystem } from 'shared/src/ecs/systems/gravity';
import { createMovementSystem } from 'shared/src/ecs/systems/movement';
import { GameWorld, createGameWorld } from 'shared/src/ecs/world';
// import { buildTargetCache } from './targeting';
import { createCollisionResolverSystem } from 'shared/src/ecs/systems/collisionResolver';
import { RawTurn } from './turn';
import { AffectedByGravity } from 'shared/src/ecs/components/affectedByGravity';
import { inputsToShot } from './shot';
import { DEFAULT_DEATHBEAM_RADIUS } from 'shared/src/consts';
import { AnyPoint, TargetCache } from 'shared/src/types';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Wormhole } from 'shared/src/ecs/components/wormhole';

/**
 * Fast forward-simulates a single shot.
 * Returns:
 *   { hit, hitEid, closestEid, closestDist2 }
 */
type SimResult = {
  didHit: boolean;
  hitEid: number;
  shotTrail: Array<AnyPoint>;
  closestEid: number;
  closestDist2: number; // squared pixels
  input: RawTurn;
  firstCollisionEid: number;
  firstCollisionT: number;
};

export const simulateShot = (
  liveWorld: GameWorld, // source of static bodies & constants
  playerId: number,
  input: RawTurn,
  targets: TargetCache,
  maxMs = 10_000,
  dtSim = 80,
): SimResult => {
  // const label = `Sim for ${playerId}`;
  // console.time(label);
  /* ------------------------------------------------------------------
     1.  Build scratch world & copy static entities
  ------------------------------------------------------------------ */
  const sim = createGameWorld(); // new registry
  sim.time = 0;
  sim.allObjects = liveWorld.allObjects;
  sim.movements = {};

  seedStaticBodies(sim, liveWorld);

  /* For *static* objects (planets, stations, wormholes, etc.) we can
     reuse the *same* component arrays by reference – no clone needed. */
  //   Position.x = Position.x; // alias; same buffer
  //   Position.y = Position.y;
  //   Collision.radius = Collision.radius;
  //   HasGravity.strength = HasGravity.strength;
  //   HasGravity.radius = HasGravity.radius;
  //   HasGravity.falloffType = HasGravity.falloffType;

  /* ------------------------------------------------------------------
     2.  Spawn a projectile entity
  ------------------------------------------------------------------ */
  const proj = addEntity(sim);

  addComponent(sim, Position, proj);
  addComponent(sim, Velocity, proj);
  addComponent(sim, Collision, proj);
  addComponent(sim, Projectile, proj);
  addComponent(sim, AffectedByGravity, proj);
  addComponent(sim, HasLifetime, proj);

  Collision.radius[proj] = DEFAULT_DEATHBEAM_RADIUS; // example shell radius
  Projectile.parent[proj] = playerId; // self-owner for trace
  HasLifetime.createdAt[proj] = 0;
  inputsToShot(playerId, proj, input);

  /* ------------------------------------------------------------------
     3.  Prepare systems
  ------------------------------------------------------------------ */
  let closestEid: number = 0;
  let closestDist2 = Infinity;
  let hitEid: number = 0;
  let firstCollisionEid = 0;
  let firstCollisionT = 0;

  const moveSys = createMovementSystem();
  const gravSys = createGravitySystem();
  const collSys = createCollisionSystem();
  const resolveSys = createCollisionResolverSystem(
    (projEid, targetEid, killed, time) => {
      removeEntity(sim, projEid);
      if (targetEid !== playerId) {
        if (killed) {
          hitEid = targetEid;
        } else {
          firstCollisionEid = targetEid;
          firstCollisionT = time;
        }
      }

      return false;
    },
  );
  const cleanupSys = createCleanupSystem(() => {
    // console.log('cleanup occurred');
  });

  /* ------------------------------------------------------------------
     4.  Time-stepping loop
  ------------------------------------------------------------------ */

  for (let t = 0; t < maxMs; t += dtSim) {
    if (firstCollisionEid) {
      firstCollisionT = t;
      break;
    }
    if (hitEid) {
      break;
    }
    sim.delta = dtSim;
    sim.time = t;

    moveSys(sim);
    gravSys(sim);
    collSys(sim);
    resolveSys(sim);
    cleanupSys(sim);

    /* projectile may have been removed */
    if (!entityExists(sim, proj)) break;

    /* track closest approach to any destructible */
    for (const trg of targets) {
      const dx = Position.x[proj] - trg.x;
      const dy = Position.y[proj] - trg.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < trg.r2) {
        hitEid = trg.eid;
        break;
      }
      if (d2 < closestDist2) {
        closestDist2 = d2;
        closestEid = trg.eid;
      }
    }
    if (hitEid) {
      break;
    }
  }

  // console.timeEnd(label);
  const shotTrail = sim.movements && sim.movements[playerId].movementTrace;

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

  // return {
  //   hit: hitEid !== null,
  //   hitEid,
  //   closestEid,
  //   closestDist2,
  // };
};

const seedStaticBodies = (sim: GameWorld, liveWorld: GameWorld) => {
  for (const obj of liveWorld.allObjects) {
    const eid = addEntity(sim); // new id is fine
    addComponent(sim, Position, eid);
    addComponent(sim, Collision, eid);

    Position.x[eid] = obj.x;
    Position.y[eid] = obj.y;
    Collision.radius[eid] = Collision.radius[obj.eid];

    if (hasComponent(liveWorld, HasGravity, obj.eid)) {
      addComponent(sim, HasGravity, eid);
      HasGravity.strength[eid] = HasGravity.strength[obj.eid];
      HasGravity.radius[eid] = HasGravity.radius[obj.eid];
      HasGravity.falloffType[eid] = HasGravity.falloffType[obj.eid];
    }

    if (hasComponent(liveWorld, Destructible, obj.eid)) {
      addComponent(sim, Destructible, eid);
    }

    if (hasComponent(liveWorld, Wormhole, obj.eid)) {
      addComponent(sim, Wormhole, eid);
      Wormhole.exitType[eid] = Wormhole.exitType[obj.eid];
      Wormhole.teleportTarget[eid] = Wormhole.teleportTarget[obj.eid];
    }
  }
};

export const isStuck = (sim: SimResult, sim2: SimResult): boolean => {
  // no collision on at least one sim, so as far as we know, we're not stuck
  if (sim.firstCollisionEid === 0) {
    return false;
  }
  const sameHit = sim.firstCollisionEid === sim2.firstCollisionEid;
  const sameTime = Math.abs(sim.firstCollisionT - sim2.firstCollisionT) < 300;
  return sameHit && sameTime;
};
