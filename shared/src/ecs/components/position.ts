import { makeComponent, Schema } from '../componentFactory';

const PositionSchema = {
  x: 'f32',
  y: 'f32',
} as const satisfies Schema;

export const Position = makeComponent(PositionSchema);
