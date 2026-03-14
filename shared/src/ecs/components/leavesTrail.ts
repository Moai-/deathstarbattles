import { MAX_ENTITIES } from "shared/src/consts";
import { defineComponentMeta, enumToOptions } from 'shared/src/utils';

export enum TrailType {
  NONE,
  BEADS,
  BEADS_ON_A_STRING,
  MANY_BEADS,
}

const MAX_STRING_DIST = 30;
export const MAX_STRING_DIST_SQ = MAX_STRING_DIST * MAX_STRING_DIST;

export const LeavesTrail = {
  type: new Uint8Array(MAX_ENTITIES),
  col: new Uint32Array(MAX_ENTITIES),
};

defineComponentMeta(LeavesTrail, {
  name: 'Leaves Trail',
  description: 'This entity leaves a trail in its path as it moves.',
  props: {
    type: {
      label: 'Trail Type',
      description: 'The way the trail will be rendered.',
      control: 'enum',
      enumOptions: enumToOptions(TrailType),
    },
    col: {
      label: 'Trail Colour',
      description: 'The colour of the trail.',
      control: 'colour'
    }
  }
});
