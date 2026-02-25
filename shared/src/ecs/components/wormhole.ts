import { MAX_ENTITIES } from "shared/src/consts";
import { nameComponent } from 'shared/src/utils';

export const Wormhole = {
  teleportTarget: new Uint32Array(MAX_ENTITIES),
  exitType: new Uint8Array(MAX_ENTITIES),
};

nameComponent(Wormhole, 'Wormhole');

export enum ExitTypes {
  PAIRED,
  RANDOM,
  PAIRED_GIANT,
}
