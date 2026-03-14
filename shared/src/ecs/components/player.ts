import { MAX_ENTITIES } from 'shared/src/consts';
import { defineComponentMeta } from 'shared/src/utils';

export const Player = {
  pooledProjectile: new Uint32Array(MAX_ENTITIES),
};

defineComponentMeta(Player, {
  name: 'Player',
  description: 'This object belongs to a player.',
  props: {
    pooledProjectile: {
      label: 'Pooled Projectile',
      description: 'Entity ID of the projectile owned by this player.',
      control: 'entity',
    }
  }
});
