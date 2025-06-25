import { makeComponent, Schema } from '../componentFactory';

const HasGravitySchema = {
  strength: 'f32',
  radius: 'f32',
  falloffType: 'ui8',
} as const satisfies Schema;

export const HasGravity = makeComponent(HasGravitySchema);

export enum GravityFalloffType {
  INVERSE_SQUARE,
  LINEAR,
  CONSTANT,
}
