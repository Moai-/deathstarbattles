import { MAX_ENTITIES } from "shared/src/consts";
import { ObjectTypes } from "shared/src/types";
import { defineComponentMeta, enumToOptions } from 'shared/src/utils';

export const ObjectInfo = {
  type: new Uint8Array(MAX_ENTITIES),
  owner: new Uint8Array(MAX_ENTITIES),
  cloneOf: new Uint32Array(MAX_ENTITIES),
};

defineComponentMeta(ObjectInfo, {
  name: 'Object Info',
  description: 'Broad-strokes information about this entity.',
  props: {
    type: {
      label: 'Object Type',
      description: 'What kind of entity this is (maps to ObjectTypes). \
This property is also used by the rendering system to figure out what \
render template to use to render this.',
      control: 'enum',
      enumOptions: enumToOptions(ObjectTypes),
    },
    owner: {
      label: 'Owner',
      description: 'Which player owns this entity.',
      control: 'number',
      step: 1,
    },
    cloneOf: {
      label: 'Clone of',
      description: 'Which entity this entity is a clone of. Used for simulation.',
      hidden: true,
    }
  }
});
