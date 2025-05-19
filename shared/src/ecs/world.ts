import { createWorld, IWorld } from 'bitecs';

export interface GameWorld extends IWorld {
  time: number;
  delta: number;
}

export const createGameWorld = () => {
  const world = createWorld() as GameWorld;
  world.time = 0;
  world.delta = 0;
  return world;
};
