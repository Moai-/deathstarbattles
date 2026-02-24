import { MAX_ENTITIES } from 'shared/src/consts';

export const HasLifetime = {
  createdAt: new Uint32Array(MAX_ENTITIES)
}