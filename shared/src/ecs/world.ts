import {
  // addComponent,
  addEntity,
  ComponentRef,
  createWorld,
  entityExists,
  getWorldComponents,
  registerComponents,
  resetWorld,
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

export const createGameWorld = (components: Array<ComponentRef>) => {
  const world = createWorld() as GameWorld;
  world.time = 0;
  world.delta = 0;
  world.movements = null;
  registerComponents(world, components);
  // make sure NULL_ENTITY exists
  // This is the ECS equivalent of null, do not add components to this
  if (!entityExists(world, NULL_ENTITY)) {
    addEntity(world);
  }
  return world;
};

export const clearWorld = (world: GameWorld) => {
  resetWorld(world);
  getWorldComponents(world).forEach((comp) => {
    const props = Object.keys(comp);
    props.forEach((prop) => {
      (comp[prop] as Float32Array).fill(0);
    })
  })
}

export { NULL_ENTITY };
