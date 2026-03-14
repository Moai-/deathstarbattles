import { MAX_ENTITIES } from "shared/src/consts";
import { defineComponentMeta } from 'shared/src/utils';

export const Velocity = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
};

defineComponentMeta(Velocity, {
  name: 'Velocity',
  description: 'Movement velocity of this entity.',
  props: {
    x: {
      label: 'X-Velocity',
      description: 'Speed of this entity along the X-axis.',
      control: 'number',
      step: 10
    },
    y: {
      label: 'Y-Velocity',
      description: 'Speed of this entity along the Y-axis.',
      control: 'number',
      step: 10
    }
  }
});
