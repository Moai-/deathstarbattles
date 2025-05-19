import { defineQuery, defineSystem, removeEntity } from 'bitecs';
import { Position } from '../components/position';

const boundQuery = defineQuery([Position]);

export const createBoundarySystem = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
) => {
  return defineSystem((world) => {
    const entities = boundQuery(world);
    for (const eid of entities) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      if (x < maxX && x > minX) {
        if (y < maxY && y > minY) {
          continue;
        }
      }
      removeEntity(world, eid);
    }
    return world;
  });
};
