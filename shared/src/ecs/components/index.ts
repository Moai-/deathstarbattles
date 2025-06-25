import { AffectedByGravity } from './affectedByGravity';
import { Collision } from './collision';
import { Destructible } from './destructible';
import { HasGravity } from './hasGravity';
import { HasLifetime } from './hasLifetime';
import { ObjectInfo } from './objectInfo';
import { Position } from './position';
import { Projectile } from './projectile';
import { Velocity } from './velocity';
import { Wormhole } from './wormhole';

export const allComponents = {
  AffectedByGravity,
  Collision,
  Destructible,
  HasGravity,
  HasLifetime,
  ObjectInfo,
  Position,
  Projectile,
  Velocity,
  Wormhole,
};

export {
  AffectedByGravity,
  Collision,
  Destructible,
  HasGravity,
  HasLifetime,
  ObjectInfo,
  Position,
  Projectile,
  Velocity,
  Wormhole,
};

export type AllComponents = typeof allComponents;
