import { defineQuery, defineSystem } from 'bitecs';
import { Position } from '../components/position';
import { Collision } from '../components/collision';
import { Projectile } from '../components/projectile';

const projectileQuery = defineQuery([Position, Collision, Projectile]);
const targetQuery = defineQuery([Position, Collision]);

export const createCollisionSystem = (
  onCollision: (projEid: number, targetEid: number) => void = () => {},
) => {
  return defineSystem((world) => {
    // Loop through projectiles
    const projectiles = projectileQuery(world);
    const targets = targetQuery(world);

    for (let i = 0; i < projectiles.length; i++) {
      const eid1 = projectiles[i];
      const pos1 = { x: Position.x[eid1], y: Position.y[eid1] };
      const rad1 = Collision.radius[eid1];

      // Check against potential targets
      for (let j = 0; j < targets.length; j++) {
        const eid2 = targets[j];
        if (eid1 === eid2) continue;

        const pos2 = { x: Position.x[eid2], y: Position.y[eid2] };
        const rad2 = Collision.radius[eid2];

        if (circlesDoOverlap(pos1.x, pos1.y, rad1, pos2.x, pos2.y, rad2)) {
          // Do collision logic
          console.log('bop');
          onCollision(eid1, eid2);
        }
      }
    }

    return world;
  });
};

const circlesDoOverlap = (
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distSq = dx * dx + dy * dy;
  const radSum = r1 + r2;
  return distSq < radSum * radSum;
};
