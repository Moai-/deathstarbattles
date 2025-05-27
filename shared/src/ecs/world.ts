import { createWorld, IWorld } from 'bitecs';
import { ObjectMovements } from '../types';

export interface GameWorld extends IWorld {
  time: number;
  delta: number;
  movements: ObjectMovements;
}

export const createGameWorld = () => {
  const world = createWorld() as GameWorld;
  // enableManualEntityRecycling(world);
  world.time = 0;
  world.delta = 0;
  return world;
};
