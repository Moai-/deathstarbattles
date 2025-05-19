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
      const angle = Velocity.angle[eid];
      const speed = Velocity.speed[eid];
      const dx = Math.cos(angle) * speed * dt * slow;
      const dy = Math.sin(angle) * speed * dt * slow;
      Position.x[eid] += dx;
      Position.y[eid] += dy;

      console.log(Position.x[eid]);
    }
    return world;
  });
};
