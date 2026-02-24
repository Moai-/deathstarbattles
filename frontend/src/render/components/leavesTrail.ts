import { MAX_ENTITIES } from "shared/src/consts";

export enum TrailType {
  NONE,
  BEADS,
  BEADS_ON_A_STRING,
  MANY_BEADS,
}

const MAX_STRING_DIST = 10;
export const MAX_STRING_DIST_SQ = MAX_STRING_DIST * MAX_STRING_DIST;

export const LeavesTrail = {
  type: new Uint8Array(MAX_ENTITIES),
  col: new Uint32Array(MAX_ENTITIES),
};
