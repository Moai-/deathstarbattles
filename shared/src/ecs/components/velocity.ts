import { defineComponent, Types } from 'bitecs';

export const Velocity = defineComponent({
  angle: Types.f32, // radians
  speed: Types.f32, // pixels per second
});
