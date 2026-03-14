import { MAX_ENTITIES } from 'shared/src/consts';
import { defineComponentMeta } from 'shared/src/utils';

export const HasLifetime = {
  createdAt: new Uint32Array(MAX_ENTITIES)
}

defineComponentMeta(HasLifetime, {
  name: 'Has Lifetime',
  description: 'An entity with this component is removed after 30 seconds.',
  props: {
    createdAt: {
      label: 'Created At',
      description: 'Time when this entity was created.',
      control: 'time',
    }
  }
});