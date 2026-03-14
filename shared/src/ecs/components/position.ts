import { MAX_ENTITIES } from 'shared/src/consts';
import { defineComponentMeta } from 'shared/src/utils';

export const Position = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
};

defineComponentMeta(Position, {
  name: 'Position',
  description: 'World position of this entity.',
  props: {
    x: {
      label: 'X-Coordinate',
      description: 'X-coordinate of this entity in the world.',
      control: 'number',
      precision: 3,
      step: 10
    },
    y: {
      label: 'Y-Coordinate',
      description: 'Y-coordinate of this entity in the world.',
      control: 'number',
      precision: 3,
      step: 10
    }
  }
});
