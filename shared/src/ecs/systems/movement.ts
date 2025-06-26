import { defineQuery, defineSystem } from 'bitecs';
import { GameWorld } from '../world';
import { Projectile } from '../components/projectile';
import { Position, Velocity } from '../components';

const slow = 1 / 400;
const movingQuery = defineQuery([Position, Velocity]);

export const createMovementSystem = () => {
  return defineSystem((world) => {
    const w = world as GameWorld;
    const dt = w.delta;
    const entities = movingQuery(world);
    if (entities.length) {
      w.movements = w.movements || {};
    }
    for (const eid of entities) {
      if (Projectile.active[eid] === 0) {
        continue;
      }
      const shooter = Projectile.parent[eid];
      w.movements![shooter] = w.movements![shooter] || {
        id: eid,
        movementTrace: [],
        destroyedTarget: null,
      };
      const vx = Velocity.x[eid];
      const vy = Velocity.y[eid];
      const dx = vx * dt * slow;
      const dy = vy * dt * slow;
      const newX = Position.x[eid] + dx;
      const newY = Position.y[eid] + dy;
      Position.x[eid] = newX;
      Position.y[eid] = newY;
      w.movements![shooter].movementTrace.push({ x: newX, y: newY });
    }
    return world;
  });
};
