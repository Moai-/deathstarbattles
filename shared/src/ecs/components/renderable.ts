import { MAX_ENTITIES } from "shared/src/consts";
import { defineComponentMeta } from 'shared/src/utils';

export const Renderable = {
  variant: new Uint8Array(MAX_ENTITIES),
  col: new Uint32Array(MAX_ENTITIES),
}

defineComponentMeta(Renderable, {
  name: 'Renderable',
  description: 'This entity can be rendered in the world.',
  props: {
    variant: {
      label: 'Render variant',
      description: 'If this entity has multiple templates by which \
it can be rendered, this controls which template to use.',
      control: 'number',
      step: 1,
    },
    col: {
      label: 'Colour',
      description: 'The main colour to use when rendering this entity.',
      control: 'colour',
    }
  }
});
