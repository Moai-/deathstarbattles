import { makeComponent, Schema } from '../componentFactory';

const HasLifetimeSchema = {
  createdAt: 'ui32',
} as const satisfies Schema;

export const HasLifetime = makeComponent(HasLifetimeSchema);
