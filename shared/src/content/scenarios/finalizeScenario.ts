import { hasComponent } from "bitecs";
import { buildColliderCache } from "shared/src/ai/functions";
import { Collision, Renderable, Wormhole } from "shared/src/ecs/components";
import { ExitTypes } from "shared/src/ecs/components/wormhole";
import { GameWorld } from "shared/src/ecs/world";
import { ObjectTypes } from "shared/src/types";
import { getType } from "shared/src/utils";

export const finalizeScenario = (world: GameWorld, stationSize: number, ignoreWormholes = false) => {
  const objectsInWorld = buildColliderCache(world);
  // 1. String together wormholes
  if (!ignoreWormholes) {
    const wormholes = objectsInWorld
      .filter((o) => hasComponent(world, o.eid, Wormhole))
      .map((o) => o.eid);
  
    for (let i = 0; i < wormholes.length; ) {
      const remaining = wormholes.length - i;
  
      if (remaining === 1) {
        scrambleWormhole(wormholes[i]);
        i += 1;
      } else {
        if (world.random.oneIn(6)) {
          scrambleWormhole(wormholes[i]);
          i += 1;
        } else if (world.random.oneIn(6)) {
          chaosifyWormhole(world, wormholes, wormholes[i]);
          i += 1;
        } else {
          pairWormholes(wormholes[i], wormholes[i + 1]);
          i += 2;
        }
      }
    }
  }

  // 2. INFLATE
  if (stationSize > 1) {
    objectsInWorld
      .filter((o) => getType(o.eid) === ObjectTypes.DEATHSTAR)
      .map((o) => o.eid)
      .forEach((eid) => {
        Collision.radius[eid] = Collision.radius[eid] * stationSize;
      });
  } 
}

const scrambleWormhole = (eid: number) => {
  Wormhole.exitType[eid] = ExitTypes.RANDOM;
  Wormhole.teleportTarget[eid] = 0;
};

const pairWormholes = (eid1: number, eid2: number) => {
  const pairType =
    getType(eid1) === ObjectTypes.BIG_WORMHOLE
      ? ExitTypes.PAIRED_GIANT
      : ExitTypes.PAIRED;
  Wormhole.exitType[eid1] = pairType;
  Wormhole.exitType[eid2] = pairType;
  Wormhole.teleportTarget[eid1] = eid2;
  Wormhole.teleportTarget[eid2] = eid1;
  Renderable.col[eid1] = Renderable.col[eid2];
};

const chaosifyWormhole = (world: GameWorld, wormholes: Array<number>, eid: number) => {
  Wormhole.exitType[eid] = ExitTypes.CHAOS;
  Wormhole.teleportTarget[eid] = world.random.pickElement(wormholes.filter((n) => n === eid))
}