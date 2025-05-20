import { defineComponent, Types } from 'bitecs';

export const Renderable = defineComponent({
  type: Types.ui8,
  size: Types.ui16,
  col: Types.ui32,
});
