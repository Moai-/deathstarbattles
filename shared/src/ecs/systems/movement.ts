import { defineQuery, defineSystem } from 'bitecs';
import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';

const movingQuery = defineQuery([Position, Velocity]);

export const createMovementSystem = () => {
  return defineSystem((world) => {
    const entities = movingQuery(world);
    for (const eid of entities) {
      Position.x[eid] += Velocity.x[eid];
      Position.y[eid] += Velocity.y[eid];
    }
    return world;
  });
};
