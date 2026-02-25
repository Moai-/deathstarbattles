import { MAX_ENTITIES } from 'shared/src/consts';
import { nameComponent } from 'shared/src/utils';

export const Projectile = {
  parent: new Uint32Array(MAX_ENTITIES),
  lastCollisionTarget: new Uint32Array(MAX_ENTITIES),
};

nameComponent(Projectile, 'Projectile');
