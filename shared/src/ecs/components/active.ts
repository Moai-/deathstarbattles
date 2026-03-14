import { defineComponentMeta } from "shared/src/utils";

export const Active = {};

defineComponentMeta(Active, {
  name: 'Active',
  description: 'Entities without this component are not rendered. \
In practice, this is used for pooled projectiles.'
});