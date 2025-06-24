import {
  // addComponent,
  addEntity,
  createWorld,
  entityExists,
  IWorld,
} from 'bitecs';
import { GameObject, ObjectMovements } from '../types';
// import { NullEntity } from './components/nullEntity';

export const NULL_ENTITY = 0;

export interface GameWorld extends IWorld {
  time: number;
  delta: number;
  movements: ObjectMovements | null;
  allObjects: Array<GameObject>;
}

export const createGameWorld = () => {
  const world = createWorld() as GameWorld;
  // enableManualEntityRecycling(world);
  world.time = 0;
  world.delta = 0;
  world.allObjects = [];
  // null entity
  if (!entityExists(world, NULL_ENTITY)) {
    addEntity(world);
    // addComponent(world, NullEntity, NULL_ENTITY);
  }
  return world;
};
