import { defineComponent, Types } from 'bitecs';

export enum TrailType {
  NONE,
  BEADS,
  BEADS_ON_A_STRING,
  MANY_BEADS,
}

const MAX_STRING_DIST = 10;
export const MAX_STRING_DIST_SQ = MAX_STRING_DIST * MAX_STRING_DIST;

export const LeavesTrail = defineComponent({
  type: Types.ui8,
  col: Types.ui32,
});
