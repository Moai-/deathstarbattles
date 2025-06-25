import { AnyPoint, TurnInput } from 'shared/src/types';
import { RawTurn } from '../functions';

export enum ComponentTags {
  AffectedByGravity= 1 << 0, // eslint-disable-line
  Collision        = 1 << 1, // eslint-disable-line
  Destructible     = 1 << 2, // eslint-disable-line
  HasGravity       = 1 << 3, // eslint-disable-line
  HasLifetime      = 1 << 4, // eslint-disable-line
  Position         = 1 << 5, // eslint-disable-line
  Projectile       = 1 << 6, // eslint-disable-line
  Velocity         = 1 << 7, // eslint-disable-line
  Wormhole         = 1 << 8, // eslint-disable-line
}

export interface SimSnapshot {
  count: number;

  // Collected entities we're interested in
  eid: Uint32Array;

  // Component tags
  componentTags: Uint32Array;

  // Component data

  // Collision
  radius: Uint16Array;

  // HasGravity
  strength: Float32Array;
  falloffType: Uint8Array;

  // HasLifetime
  createdAt: Uint32Array;

  // ObjectInfo
  type: Uint8Array;

  // Position
  posX: Float32Array;
  posY: Float32Array;

  // Projectile
  parent: Uint32Array;
  lastCollisionTarget: Uint32Array;

  // Velocity
  velX: Float32Array;
  velY: Float32Array;

  // Wormhole
  teleportTarget: Uint32Array;
  exitType: Uint8Array;
}

export enum SimMessageType {
  ACTIVE,
  INITIALIZE,
  INITIALIZE_DONE,
  SIMULATE,
  SIMULATE_DONE,
}

export type SimMessage = {
  snapshot?: SimSnapshot;
  type: SimMessageType;
  result?: SimResult;
  turnInput?: TurnInput;
};

export type SimResult = {
  didHit: boolean;
  hitEid: number;
  shotTrail: Array<AnyPoint>;
  closestEid: number;
  closestDist2: number; // squared pixels
  input: RawTurn;
  firstCollisionEid: number;
  firstCollisionT: number;
};
