import { hasComponent } from 'bitecs';
import { buildColliderCache } from 'shared/src/ai/functions';
import { Wormhole } from 'shared/src/ecs/components';
import { GameWorld } from 'shared/src/ecs/world';
import { scrambleWormhole, pairWormholes } from 'shared/src/utils';

export const finalizeSetup = (world: GameWorld) => {
  const objectsInWorld = buildColliderCache(world);
  const wormholes = objectsInWorld
    .filter((o) => hasComponent(world, Wormhole, o.eid))
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
};
