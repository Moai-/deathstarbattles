import { MAX_ENTITIES } from "shared/src/consts";
import { nameComponent } from 'shared/src/utils';

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

  // Dirty flags
  _prevRotation: new Float32Array(MAX_ENTITIES),
  _prevSpread: new Float32Array(MAX_ENTITIES),
  
};

nameComponent(HasPolarJets, 'HasPolarJets');