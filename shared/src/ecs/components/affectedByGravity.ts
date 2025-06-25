import { makeComponent, Schema } from '../componentFactory';

const AffectedByGravitySchema = {} as const satisfies Schema;

export const AffectedByGravity = makeComponent(AffectedByGravitySchema);
