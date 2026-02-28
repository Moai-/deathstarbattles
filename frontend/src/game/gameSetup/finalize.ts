import { hasComponent } from 'bitecs';
import { buildColliderCache } from 'shared/src/ai/functions';
import { Collision, HasGravity, Wormhole } from 'shared/src/ecs/components';
import { GravityFalloffType } from 'shared/src/ecs/components/hasGravity';
import { GameWorld } from 'shared/src/ecs/world';
import { Backgrounds, ObjectTypes } from 'shared/src/types';
import {
  scrambleWormhole,
  pairWormholes,
  getHyperLocus,
  getPosition,
  getType,
  getRadius,
} from 'shared/src/utils';
import { generateBackground } from 'src/render/background';
import { generateBackgroundShards } from 'src/render/background/shardTunnel';
import { Renderable } from 'src/render/components/renderable';

export const finalizeSetup = (
  world: GameWorld,
  scene: Phaser.Scene,
  bg: Backgrounds,
  stationSize: number,
) => {
  const objectsInWorld = buildColliderCache(world);
  const wormholes = objectsInWorld
    .filter((o) => hasComponent(world, o.eid, Wormhole))
    .map((o) => o.eid);

  for (let i = 0; i < wormholes.length; ) {
    const remaining = wormholes.length - i;

    if (remaining === 1) {
      scrambleWormhole(wormholes[i]);
      i += 1;
    } else {
      const roll = Math.random();
      if (roll < 1 / 6) {
        scrambleWormhole(wormholes[i]);
        i += 1;
      } else {
        pairWormholes(wormholes[i], wormholes[i + 1]);
        i += 2;
      }
    }
  }

  const locus = getHyperLocus(world);
  if (bg !== Backgrounds.SHARDS) {
    generateBackground(bg, scene);
  } else {
    if (locus) {
      const pos = getPosition(locus);
      generateBackgroundShards(scene, 300, pos);
      objectsInWorld
        .filter((o) => getType(o.eid) === ObjectTypes.ANOMALY)
        .map((o) => o.eid)
        .forEach((eid) => (Renderable.variant[eid] = 1));
    }
  }

  // INFLATE
  // if (stationSize > 1) {
    objectsInWorld
      .filter((o) => getType(o.eid) === ObjectTypes.DEATHSTAR)
      .map((o) => o.eid)
      .forEach((eid) => {
        Collision.radius[eid] = Collision.radius[eid] * 5;
        // Collision.radius[eid] = Collision.radius[eid] * stationSize;
      });
  // }
};
