import { TurnInput, SimShotResult } from 'shared/src/types';

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
  Active           = 1 << 9, // eslint-disable-line
  AffectedByJets   = 1 << 10,
  HasPolarJets     = 1 << 11
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
  active: Uint8Array;

  // Velocity
  velX: Float32Array;
  velY: Float32Array;

  // Wormhole
  teleportTarget: Uint32Array;
  exitType: Uint8Array;

  // Jets
  jetStrength: Float32Array;
  innerRadius: Float32Array;
  rotation: Float32Array;
  length: Float32Array;
  _tanHalfSpread: Float32Array;
  spreadRad: Float32Array;
  _dirX: Float32Array;
  _dirY: Float32Array;
  _perpX: Float32Array;
  _perpY: Float32Array;
  _prevRotation: Float32Array;
  _prevSpread: Float32Array;
  corePow: Float32Array;
  endFadeFrac: Float32Array;
  outerFadeBias: Float32Array;
  deflectAngleRad: Float32Array;
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
  result?: SimShotResult;
  turnInput?: TurnInput;
};
