import { World, addComponent } from "bitecs";
import { HasPolarJets, Collision } from "shared/src/ecs/components";
import { degToRad } from "shared/src/utils";

type AddJetsOpts = {
  axisAngle: number;     // direction the jet points (world)
  spreadAngle?: number;       // V width (full angle)
  deflectAngle?: number; // max off-axis deflection at the edges
  length?: number;
  innerRadius?: number;
  strength?: number;

  corePow?: number;
  endFadeFrac?: number;
  outerFadeBias?: number;
};

// Adds polar jets to an entity
export const addJets = (eid: number, world: World, opts: AddJetsOpts) => {
  addComponent(world, eid, HasPolarJets);
  const r = Collision.radius[eid];

  const axis = degToRad(opts.axisAngle);

  const spreadRad = degToRad(opts.spreadAngle ?? 12);
  const deflect = degToRad(opts.deflectAngle ?? 10);

  const innerRadius = opts.innerRadius ?? r * 1.05;
  const length = opts.length ?? r * 100;

  HasPolarJets.innerRadius[eid] = innerRadius;
  HasPolarJets.length[eid] = length;
  HasPolarJets.rotation[eid] = axis;

  HasPolarJets.spreadRad[eid] = spreadRad;
  HasPolarJets._tanHalfSpread[eid] = Math.tan(spreadRad * 0.5);

  HasPolarJets.deflectAngleRad[eid] = deflect;
  HasPolarJets.jetStrength[eid] = opts.strength ?? 10;

  HasPolarJets.corePow[eid] = opts.corePow ?? 3.6;
  HasPolarJets.endFadeFrac[eid] = opts.endFadeFrac ?? 0.22;
  HasPolarJets.outerFadeBias[eid] = opts.outerFadeBias ?? 0.75;

  // Precompute basis for this axis
  const c = Math.cos(axis);
  const s = Math.sin(axis);

  HasPolarJets._dirX[eid] = c;
  HasPolarJets._dirY[eid] = s;

  HasPolarJets._perpX[eid] = -s;
  HasPolarJets._perpY[eid] = c;
};