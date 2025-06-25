import { makeComponent, Schema } from '../componentFactory';

const VelocitySchema = {
  x: 'f32',
  y: 'f32',
} as const satisfies Schema;

export const Velocity = makeComponent(VelocitySchema);
