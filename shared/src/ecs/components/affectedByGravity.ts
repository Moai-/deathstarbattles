import { defineComponentMeta } from "shared/src/utils";

export const AffectedByGravity = {};

defineComponentMeta(AffectedByGravity, {
  name: 'Affected by Gravity',
  description: 'Whether this component is acted upon by objects \
with the HasGravity component.'
});