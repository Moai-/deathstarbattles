import { Active } from './active';
import { Collision } from './collision';
import { Destructible } from './destructible';
import { HyperLocus } from './hyperLocus';
import { ObjectInfo } from './objectInfo';
import { Position } from './position';

export const collidingEntities = [Collision, Position, Active];
export const targetEntities = [Collision, Position, Destructible, ObjectInfo, Active];
export const locusEntities = [HyperLocus, Active];