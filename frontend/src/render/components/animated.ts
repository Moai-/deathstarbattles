import { MAX_ENTITIES } from "shared/src/consts";
import { nameComponent } from 'shared/src/utils';

export const Animated = {
  type: new Uint8Array(MAX_ENTITIES),
  frame: new Uint16Array(MAX_ENTITIES),
};

nameComponent(Animated, 'Animated');
