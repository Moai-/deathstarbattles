import { allComponents } from '../components';
import { createCleanupSystem } from './cleanup';
import { createCollisionSystem } from './collision';
import { createCollisionResolverSystem } from './collisionResolver';
import { createGravitySystem } from './gravity';
import { createMovementSystem } from './movement';

export const createBaseCollisionSystem = () =>
  createCollisionSystem(allComponents);

export const createBaseCollisionResolverSystem = (
  onCollision?: (
    projEid: number,
    targetEid: number,
    hitDestructible: boolean,
    time: number,
  ) => boolean,
) => createCollisionResolverSystem(allComponents, onCollision);

export const createBaseGravitySystem = () => createGravitySystem(allComponents);

export const createBaseMovementSystem = () =>
  createMovementSystem(allComponents);

export const createBaseCleanupSystem = (
  onEntityCleanedUp?: (eid: number) => void,
) => createCleanupSystem(allComponents, onEntityCleanedUp);
