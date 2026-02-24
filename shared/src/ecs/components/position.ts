import { MAX_ENTITIES } from 'shared/src/consts';
import { nameComponent } from 'shared/src/utils';

export const Position = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
};

nameComponent(Position, 'Position');
