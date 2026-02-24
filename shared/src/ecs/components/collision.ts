import { MAX_ENTITIES } from 'shared/src/consts';
import { nameComponent } from 'shared/src/utils';

export const Collision = {
  radius: new Uint16Array(MAX_ENTITIES)
}

nameComponent(Collision, 'Collision');