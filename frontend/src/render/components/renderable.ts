import { defineComponent, Types } from 'bitecs';

export const Renderable = defineComponent({
  hidden: Types.ui8,
  didVisibilityChange: Types.ui8,
  col: Types.ui32,
});
