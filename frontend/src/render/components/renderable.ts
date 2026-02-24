import { MAX_ENTITIES } from "shared/src/consts";
import { nameComponent } from 'shared/src/utils';

export const Renderable = {
  variant: new Uint8Array(MAX_ENTITIES),
  col: new Uint32Array(MAX_ENTITIES),
}

nameComponent(Renderable, 'Renderable');
