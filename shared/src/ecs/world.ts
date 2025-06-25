import {
  // addComponent,
  addEntity,
  createWorld,
  entityExists,
  IWorld,
} from 'bitecs';
import { GameObject, ObjectMovements } from '../types';
import { NULL_ENTITY } from '../consts';

export interface GameWorld extends IWorld {
  time: number;
  delta: number;
  movements: ObjectMovements | null;
  allObjects: Array<GameObject>;
}

export const createGameWorld = () => {
  const world = createWorld() as GameWorld;
  world.time = 0;
  world.delta = 0;
  world.allObjects = [];
  world.movements = null;
  // null entity
  if (!entityExists(world, NULL_ENTITY)) {
    addEntity(world);
  }
  return world;
};

export { NULL_ENTITY };
