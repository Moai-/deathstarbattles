import { MAX_ENTITIES } from "shared/src/consts";

export const Renderable = {
  variant: new Uint8Array(MAX_ENTITIES),
  col: new Uint32Array(MAX_ENTITIES),
}
