import { MAX_ENTITIES } from 'shared/src/consts';
import { defineComponentMeta } from "shared/src/utils";

export const Collision = {
  radius: new Uint16Array(MAX_ENTITIES)
}

defineComponentMeta(Collision, {
  name: 'Collision',
  description: 'Whether this component has a collision radius.',
  props: {
    radius: {
      label: 'Radius',
      description: 'Sphere radius that defines where the collision will happen. \
Most render templates also use this number to determine the size of the rendered entity.',
      control: 'number',
      step: 1
    }
  }
});