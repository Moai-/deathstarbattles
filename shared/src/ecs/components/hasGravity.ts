import { defineComponent, Types } from 'bitecs';

export const HasGravity = defineComponent({
  strength: Types.f32,
  radius: Types.f32,
  falloffType: Types.ui8,
});

export enum GravityFalloffType {
  INVERSE_SQUARE,
  LINEAR,
  CONSTANT,
}
