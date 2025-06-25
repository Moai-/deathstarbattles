import { makeComponent, Schema } from '../componentFactory';

const WormholeSchema = {
  teleportTarget: 'eid',
  exitType: 'ui8',
} as const satisfies Schema;

export const Wormhole = makeComponent(WormholeSchema);

export enum ExitTypes {
  PAIRED,
  RANDOM,
  PAIRED_GIANT,
}
