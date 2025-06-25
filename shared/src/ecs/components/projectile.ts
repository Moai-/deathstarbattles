import { makeComponent, Schema } from '../componentFactory';

const ProjectileSchema = {
  parent: 'eid',
  lastCollisionTarget: 'eid',
} as const satisfies Schema;

export const Projectile = makeComponent(ProjectileSchema);
