import { defineQuery, defineSystem } from 'bitecs';
import { GameWorld } from '../world';
import { Projectile, Active, Position } from '../components';
import { getPosition } from 'shared/src/utils';

const projectileQuery = defineQuery([Position, Projectile, Active]);

export const createPathTrackerSystem = () => {
  return defineSystem((w) => {
    const world = w as GameWorld;
    const projectiles = projectileQuery(world);
    if (projectiles.length) {
      world.movements = world.movements || {};
    }
    for (const eid of projectiles) {
      const shooter = Projectile.parent[eid];
      world.movements![shooter] = world.movements![shooter] || {
        id: eid,
        movementTrace: [],
        destroyedTarget: null,
      };
      const { x, y } = getPosition(eid);
      world.movements![shooter].movementTrace.push({ x, y });
    }

    return world;
  });
};
