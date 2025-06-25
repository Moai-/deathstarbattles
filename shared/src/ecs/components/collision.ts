import { makeComponent, Schema } from '../componentFactory';

const CollisionSchema = {
  radius: 'ui16',
} as const satisfies Schema;

export const Collision = makeComponent(CollisionSchema);
