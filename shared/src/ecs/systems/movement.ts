import { defineQuery, defineSystem } from 'bitecs';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';
import { GameWorld } from '../world';

const movingQuery = defineQuery([Position, Velocity]);

const slow = 1 / 400;

export const createMovementSystem = () => {
  return defineSystem((world) => {
    const dt = (world as GameWorld).delta;
    const entities = movingQuery(world);
    for (const eid of entities) {
      const vx = Velocity.x[eid];
      const vy = Velocity.y[eid];
      const dx = vx * dt * slow;
      const dy = vy * dt * slow;
      Position.x[eid] += dx;
      Position.y[eid] += dy;
    }
    return world;
  });
};
