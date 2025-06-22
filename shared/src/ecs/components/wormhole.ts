import { defineComponent, Types } from 'bitecs';

export const Wormhole = defineComponent({
  teleportTarget: Types.eid,
  exitType: Types.ui8,
});

export enum ExitTypes {
  PAIRED,
  RANDOM,
  PAIRED_GIANT,
}
