import { MAX_ENTITIES } from "shared/src/consts";
import { nameComponent } from 'shared/src/utils';

export const ObjectInfo = {
  type: new Uint8Array(MAX_ENTITIES),
  cloneOf: new Uint32Array(MAX_ENTITIES),
};

nameComponent(ObjectInfo, 'ObjectInfo');
