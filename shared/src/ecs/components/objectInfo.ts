import { makeComponent, Schema } from '../componentFactory';

const ObjectInfoSchema = {
  type: 'ui8',
  cloneOf: 'eid',
} as const satisfies Schema;

export const ObjectInfo = makeComponent(ObjectInfoSchema);
