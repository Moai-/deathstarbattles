import { Active } from './active';
import { Collision } from './collision';
import { Destructible } from './destructible';
import { HyperLocus } from './hyperLocus';
import { Position } from './position';

export const collidingEntities = [Collision, Position, Active];
export const targetEntities = [Collision, Position, Destructible, Active];
export const locusEntities = [HyperLocus, Active];