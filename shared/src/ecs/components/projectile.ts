import { MAX_ENTITIES } from 'shared/src/consts';

export const Projectile = {
  parent: new Uint32Array(MAX_ENTITIES),
  lastCollisionTarget: new Uint32Array(MAX_ENTITIES),
};
