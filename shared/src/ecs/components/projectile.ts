import { defineComponent, Types } from 'bitecs';

export const Projectile = defineComponent({
  parent: Types.eid,
  lastCollisionTarget: Types.eid,
  active: Types.ui8,
});
