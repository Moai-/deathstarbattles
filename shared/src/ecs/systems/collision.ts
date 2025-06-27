import { defineQuery, defineSystem } from 'bitecs';
import { Position, Collision, Projectile, Active } from '../components';
import { circlesDoOverlap } from 'shared/src/utils';

const projectileQuery = defineQuery([Position, Collision, Projectile, Active]);
const targetQuery = defineQuery([Position, Collision, Active]);

export const createCollisionSystem = () => {
  return defineSystem((world) => {
    const projectiles = projectileQuery(world);
    const targets = targetQuery(world);

    for (let i = 0; i < projectiles.length; i++) {
      const eid1 = projectiles[i];

      const pos1 = { x: Position.x[eid1], y: Position.y[eid1] };
      const rad1 = Collision.radius[eid1];

      for (let j = 0; j < targets.length; j++) {
        const eid2 = targets[j];
        if (eid1 === eid2) continue;

        const pos2 = { x: Position.x[eid2], y: Position.y[eid2] };
        const rad2 = Collision.radius[eid2];

        if (circlesDoOverlap(pos1.x, pos1.y, rad1, pos2.x, pos2.y, rad2)) {
          Projectile.lastCollisionTarget[eid1] = eid2;
        }
      }
    }

    return world;
  });
};
