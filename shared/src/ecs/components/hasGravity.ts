import { MAX_ENTITIES } from 'shared/src/consts';
import { nameComponent } from 'shared/src/utils';

export const HasGravity = {
  strength: new Float32Array(MAX_ENTITIES),
  radius: new Float32Array(MAX_ENTITIES),
  falloffType: new Uint8Array(MAX_ENTITIES),
}

nameComponent(HasGravity, 'HasGravity');

export enum GravityFalloffType {
  INVERSE_SQUARE,
  LINEAR,
  CONSTANT,
}
