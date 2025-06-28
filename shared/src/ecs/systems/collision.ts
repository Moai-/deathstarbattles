import { defineQuery, defineSystem } from 'bitecs';
import { Position, Collision, Projectile, Active } from '../components';
import { doObjectsOverlap } from 'shared/src/utils';

const projectileQuery = defineQuery([Position, Collision, Projectile, Active]);
const targetQuery = defineQuery([Position, Collision, Active]);

export const createCollisionSystem = () => {
  return defineSystem((world) => {
    const projectiles = projectileQuery(world);
    const targets = targetQuery(world);

    for (let i = 0; i < projectiles.length; i++) {
      const eid1 = projectiles[i];

      for (let j = 0; j < targets.length; j++) {
        const eid2 = targets[j];
        if (eid1 === eid2) continue;

        if (doObjectsOverlap(eid1, eid2)) {
          Projectile.lastCollisionTarget[eid1] = eid2;
        }
      }
    }

    return world;
  });
};
