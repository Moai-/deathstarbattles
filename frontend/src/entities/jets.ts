import { addComponent, World } from "bitecs";
import { Collision } from "shared/src/ecs/components";
import { HasPolarJets } from "shared/src/ecs/components/hasPolarJets";

type AddJetsOpts = {
  axisAngleRad: number;     // direction the jet points (world)
  spreadRad?: number;       // V width (full angle)
  deflectAngleRad?: number; // max off-axis deflection at the edges
  length?: number;
  innerRadius?: number;
  strength?: number;

  corePow?: number;
  endFadeFrac?: number;
  outerFadeBias?: number;
};

 export const addJets = (eid: number, world: World, opts: AddJetsOpts) => {
  addComponent(world, eid, HasPolarJets);
  const r = Collision.radius[eid];

  const axis = opts.axisAngleRad;

  const spreadRad = opts.spreadRad ?? Phaser.Math.DegToRad(12);
  const deflect = opts.deflectAngleRad ?? Phaser.Math.DegToRad(10);

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