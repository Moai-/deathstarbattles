import { makeComponent, Schema } from '../componentFactory';

const DestructibleSchema = {} as const satisfies Schema;

export const Destructible = makeComponent(DestructibleSchema);
