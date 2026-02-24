import { query, World } from 'bitecs';
import { Position, Collision, Projectile, Active } from '../components';
import { doObjectsOverlap } from 'shared/src/utils';

const projectileEntities = [Position, Collision, Projectile, Active];
const targetEntities = [Position, Collision, Active];

export const createCollisionSystem = () => {
  return (world: World) => {
    const projectiles = query(world, projectileEntities);
    const targets = query(world, targetEntities);

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
  }
};
