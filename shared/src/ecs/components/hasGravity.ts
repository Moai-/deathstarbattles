import { MAX_ENTITIES } from 'shared/src/consts';

export const HasGravity = {
  strength: new Float32Array(MAX_ENTITIES),
  radius: new Float32Array(MAX_ENTITIES),
  falloffType: new Uint8Array(MAX_ENTITIES),
}

export enum GravityFalloffType {
  INVERSE_SQUARE,
  LINEAR,
  CONSTANT,
}
