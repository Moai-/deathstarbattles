import { MAX_ENTITIES } from 'shared/src/consts';
import { defineComponentMeta } from 'shared/src/utils';

export const Projectile = {
  parent: new Uint32Array(MAX_ENTITIES),
  lastCollisionTarget: new Uint32Array(MAX_ENTITIES),
};

defineComponentMeta(Projectile, {
  name: 'Projectile',
  description: 'This entity is a projectile fired by another entity.',
  props: {
    parent: {
      label: 'Parent entity',
      description: 'The entity that fired this projectile.',
      control: 'entity',
    },
    lastCollisionTarget: {
      label: 'Last Collision Target',
      description: 'The last entity this projectile collided with.',
      control: 'entity',
      hidden: true,
    }
  }
});
