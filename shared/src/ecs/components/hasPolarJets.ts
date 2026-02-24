import { MAX_ENTITIES } from "shared/src/consts";

export const HasPolarJets = {
  // Base acceleration magnitude
  jetStrength: new Float32Array(MAX_ENTITIES),

  // Geometry
  innerRadius: new Float32Array(MAX_ENTITIES),
  length: new Float32Array(MAX_ENTITIES),
  tanHalfSpread: new Float32Array(MAX_ENTITIES),
  spreadRad: new Float32Array(MAX_ENTITIES),

  // Precomputed basis (so we don't sin/cos every loop)
  dirX: new Float32Array(MAX_ENTITIES),
  dirY: new Float32Array(MAX_ENTITIES),
  perpX: new Float32Array(MAX_ENTITIES),
  perpY: new Float32Array(MAX_ENTITIES),

  // Shaping
  corePow: new Float32Array(MAX_ENTITIES),
  endFadeFrac: new Float32Array(MAX_ENTITIES), 
  outerFadeBias: new Float32Array(MAX_ENTITIES), 

  // Deflection angle
  deflectAngleRad: new Float32Array(MAX_ENTITIES),
};