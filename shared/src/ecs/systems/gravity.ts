import { defineSystem, defineQuery } from 'bitecs';
import { GameWorld } from '../world';
import { GravityFalloffType, HasGravity } from '../components/hasGravity';
import { Position, AffectedByGravity, Velocity } from '../components';

const GRAVITY_EPSILON = 0.0001;
const sourceQuery = defineQuery([HasGravity, Position]);
const targetQuery = defineQuery([AffectedByGravity, Velocity, Position]);
export const createGravitySystem = () => {
  return defineSystem((world: GameWorld) => {
    const dt = world.delta;
    const sources = sourceQuery(world);
    const targets = targetQuery(world);

    for (const eid of targets) {
      let ax = 0;
      let ay = 0;
      const x = Position.x[eid];
      const y = Position.y[eid];

      for (const sid of sources) {
        const sx = Position.x[sid];
        const sy = Position.y[sid];
        const dx = sx - x;
        const dy = sy - y;
        const distSq = dx * dx + dy * dy + GRAVITY_EPSILON;
        const dist = Math.sqrt(distSq);

        const strength = HasGravity.strength[sid];
        const radius = HasGravity.radius[sid] || 0;
        const falloffType =
          HasGravity.falloffType[sid] ?? GravityFalloffType.INVERSE_SQUARE;

        if (radius > 0 && dist > radius) {
          continue;
        }

        let force = 0;
        switch (falloffType) {
          case GravityFalloffType.CONSTANT:
            force = strength;
            break;
          case GravityFalloffType.LINEAR:
            if (radius > 0) {
              const factor = 1 - dist / radius;
              force = strength * Math.max(0, factor);
            } else {
              force = strength / (dist + GRAVITY_EPSILON);
            }
            break;
          case GravityFalloffType.INVERSE_SQUARE:
          default:
            force = strength / distSq;
            break;
        }

        // Apply force directionally
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        ax += fx;
        ay += fy;
      }

      Velocity.x[eid] += ax * dt;
      Velocity.y[eid] += ay * dt;
    }

    return world;
  });
};
