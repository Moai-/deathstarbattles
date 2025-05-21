import { defineComponent, Types } from 'bitecs';

export const HasLifetime = defineComponent({
  createdAt: Types.ui32, // or f64 if you're doing high-precision timing
});
