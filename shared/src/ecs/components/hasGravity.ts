import { MAX_ENTITIES } from 'shared/src/consts';
import { defineComponentMeta, enumToOptions } from 'shared/src/utils';

export const HasGravity = {
  strength: new Float32Array(MAX_ENTITIES),
  falloffType: new Uint8Array(MAX_ENTITIES),
  radius: new Uint16Array(MAX_ENTITIES),
}

export enum GravityFalloffType {
  INVERSE_SQUARE,
  LINEAR,
  CONSTANT,
}

defineComponentMeta(HasGravity, {
  name: 'Has Gravity',
  description: 'This component applies a gravitational force on \
entities with the Affected by Gravity component.',
  props: {
    strength: {
      label: 'Strength',
      description: 'Gravitational strength of this component.',
      control: 'number',
      step: 50,
    },
    falloffType: {
      label: 'Falloff Type',
      description: 'The type of gravity applied by this component.',
      control: 'enum',
      enumOptions: enumToOptions(GravityFalloffType)
    },
    radius: {
      label: 'Gravity Range Radius',
      description: 'If specified, does not apply gravity beyond specified range.',
      control: 'number',
      step: 10
    }
  }
});


