import {
  // addComponent,
  addEntity,
  createWorld,
  entityExists,
  registerComponents,
  World,
} from 'bitecs';
import { ObjectMovements } from '../types';
import { NULL_ENTITY } from '../consts';
import * as components from './components';

export interface GameWorld extends World {
  time: number;
  delta: number;
  movements: ObjectMovements | null;
  debug: boolean;
}

export const createGameWorld = () => {
  const world = createWorld() as GameWorld;
  world.time = 0;
  world.delta = 0;
  world.movements = null;
  const comps = Object.values(components);
  registerComponents(world, comps);
  // make sure NULL_ENTITY exists
  // This is the ECS equivalent of null, do not add components to this
  if (!entityExists(world, NULL_ENTITY)) {
    addEntity(world);
  }
  return world;
};

export { NULL_ENTITY };
