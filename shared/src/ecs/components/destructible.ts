import { defineComponentMeta } from "shared/src/utils"

export const Destructible = {}

defineComponentMeta(Destructible, {
  name: 'Destructible',
  description: 'Whether this component can be destroyed by entities \
with the Projectile component.'
});