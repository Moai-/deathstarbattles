import { defineComponentMeta } from "shared/src/utils";

export const AffectedByJets = {};

defineComponentMeta(AffectedByJets, {
  name: 'Affected by Jets',
  description: 'Whether this component is affected by \
entities with the HasJets component.'
});