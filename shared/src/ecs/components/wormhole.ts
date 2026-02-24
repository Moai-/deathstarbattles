import { MAX_ENTITIES } from "shared/src/consts";

export const Wormhole = {
  teleportTarget: new Uint32Array(MAX_ENTITIES),
  exitType: new Uint8Array(MAX_ENTITIES),
};

export enum ExitTypes {
  PAIRED,
  RANDOM,
  PAIRED_GIANT,
}
