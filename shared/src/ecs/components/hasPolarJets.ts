import { MAX_ENTITIES } from "shared/src/consts";
import { defineComponentMeta } from 'shared/src/utils';

export const HasPolarJets = {
  // Base acceleration magnitude
  jetStrength: new Float32Array(MAX_ENTITIES),

  // Geometry
  innerRadius: new Float32Array(MAX_ENTITIES),
  length: new Float32Array(MAX_ENTITIES),
  spreadRad: new Float32Array(MAX_ENTITIES),
  rotation: new Float32Array(MAX_ENTITIES),

  // Shaping
  corePow: new Float32Array(MAX_ENTITIES),
  endFadeFrac: new Float32Array(MAX_ENTITIES), 
  outerFadeBias: new Float32Array(MAX_ENTITIES), 

  // Deflection angle
  deflectAngleRad: new Float32Array(MAX_ENTITIES),
  
  // Precomputed basis (so we don't sin/cos every loop)
  _dirX: new Float32Array(MAX_ENTITIES),
  _dirY: new Float32Array(MAX_ENTITIES),
  _perpX: new Float32Array(MAX_ENTITIES),
  _perpY: new Float32Array(MAX_ENTITIES),
  _tanHalfSpread: new Float32Array(MAX_ENTITIES),

  // Dirty flags to recompute internal vars above
  _prevRotation: new Float32Array(MAX_ENTITIES),
  _prevSpread: new Float32Array(MAX_ENTITIES),
  
};

defineComponentMeta(HasPolarJets, {
  name: 'Has Polar Jets',
  description: 'This entity emits two opposing polar jets that push \
affected objects (needs Affected by Jets component).',
  props: {
    jetStrength: {
      label: 'Jet Strength',
      description: 'Base force applied by the jet.',
      control: 'number',
      step: 1,
    },
    innerRadius: {
      label: 'Inner Radius',
      description: 'Distance / offset from the source center where the jet begins.',
      control: 'number',
      step: 1
    },
    length: {
      label: 'Length',
      description: 'How far the jet extends outward from its start point.',
      control: 'number',
      step: 10,
    },
    spreadRad: {
      label: 'Spread Angle',
      description: 'Full angular width of the jet cone.',
      control: 'angle',
    },
    rotation: {
      label: 'Rotation',
      description: 'World-space direction of the jet axis.',
      control: 'angle',
    },
    deflectAngleRad: {
      label: 'Deflection angle',
      description: 'Maximum sideways bend applied near the outer edges of the jet.',
      control: 'angle',
    },
    corePow: {
      label: 'Core power',
      description: "Controls the falloff from the center of the jet toward its edges. Higher values make the jet's core narrower and stronger.",
      control: 'number',
      step: 0.1
    },
    endFadeFrac: {
      label: 'End fade fraction',
      description: "Fraction of the jet's length used to fade out its force near the end.",
      control: 'number',
      step: 0.01,
    },
    outerFadeBias: {
      label: 'Outer fade bias',
      description: "Biases the end fade so the jet's edges lose strength sooner than its core. Higher values make the outer parts of the jet taper off earlier.",
      step: 0.05,
    },
    _dirX: {
      label: 'Jet direction X (precomputed)',
      hidden: true,
    },
    _dirY: {
      label: 'Jet direction Y (precomputed)',
      hidden: true,
    },
    _perpX: {
      label: 'Jet perpendicular X (precomputed)',
      hidden: true,
    },
    _perpY: {
      label: 'Jet perpendicular Y (precomputed)',
      hidden: true,
    },
    _tanHalfSpread: {
      label: 'Spread tan 1/2 (precomputed)',
      hidden: true,
    },
    _prevRotation: {
      label: 'Previous rotation (internal)',
      hidden: true
    },
    _prevSpread: {
      label: 'Previous spread (internal)',
      hidden: true
    }
  }
});