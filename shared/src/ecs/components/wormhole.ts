import { defineComponent, Types } from 'bitecs';

export const Wormhole = defineComponent({
  teleportTarget: Types.eid,
  noExit: Types.ui8,
});
