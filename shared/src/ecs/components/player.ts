import { MAX_ENTITIES } from 'shared/src/consts';
import { nameComponent } from 'shared/src/utils';

export const Player = {
  pooledProjectile:  new Uint32Array(MAX_ENTITIES),
};

nameComponent(Player, 'Player');
