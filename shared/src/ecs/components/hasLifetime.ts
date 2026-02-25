import { MAX_ENTITIES } from 'shared/src/consts';
import { nameComponent } from 'shared/src/utils';

export const HasLifetime = {
  createdAt: new Uint32Array(MAX_ENTITIES)
}

nameComponent(HasLifetime, 'HasLifetime');