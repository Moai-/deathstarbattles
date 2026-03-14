import { MAX_ENTITIES } from "shared/src/consts";
import { defineComponentMeta, enumToOptions } from 'shared/src/utils';

export const Wormhole = {
  teleportTarget: new Uint32Array(MAX_ENTITIES),
  exitType: new Uint8Array(MAX_ENTITIES),
};

export enum ExitTypes {
  RANDOM,
  PAIRED,
  PAIRED_GIANT,
  CHAOS,
}

defineComponentMeta(Wormhole, {
  name: 'Wormhole',
  description: 'This entity is a wormhole that teleports projectiles.',
  props: {
    teleportTarget: {
      label: 'Teleport Target',
      description: 'Entity ID which serves as the destination for this wormhole. \
      Applicable only for exit types Paired and Paired Giant.',
    },
    exitType: {
      label: 'Exit Type',
      description: 'How teleportation behaves for this wormhole. \
Random teleports it to a random unoccuped spot on the map. \
Paired makes it exit at the same angle and speed from the entity at the specified id. \
Paired Giant is equivalent to paired, but has special handling code for colossal wormholes. \
Chaos makes the projectile manifest from the surface of any other wormhole in the level.',
      control: 'enum',
      enumOptions: enumToOptions(ExitTypes),
    }
  }
});
