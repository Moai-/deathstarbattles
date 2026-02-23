import { defineComponent, Types } from "bitecs";

export const HasPolarJets = defineComponent({
  // Base acceleration magnitude
  strength: Types.f32,

  // Geometry
  innerRadius: Types.f32,
  length: Types.f32,
  tanHalfSpread: Types.f32,
  spreadRad: Types.f32,

  // Precomputed basis (so we don't sin/cos every loop)
  dirX: Types.f32,
  dirY: Types.f32,
  perpX: Types.f32,
  perpY: Types.f32,

  // Shaping
  corePow: Types.f32,
  endFadeFrac: Types.f32, 
  outerFadeBias: Types.f32, 

  // Deflection angle
  deflectAngleRad: Types.f32,
});