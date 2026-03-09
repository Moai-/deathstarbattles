import { EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { HasGravity, Renderable, Wormhole } from "shared/src/ecs/components";
import { BASE_ANOMALY_RAD, BASE_GRAV, BASE_LINEAR_GRAV } from "../consts";
import { GravityFalloffType } from "shared/src/ecs/components/hasGravity";
import { addComponent } from "bitecs";
import { ExitTypes } from "shared/src/ecs/components/wormhole";
import { rgb } from "shared/src/utils";

export enum AnomalyEffect {
  AN_WHITE_HOLE,
  AN_WHITE_DWARF,
  AN_HEAVY,
  AN_NORMAL,
  AN_LIGHT,
  AN_LINEAR,
  AN_HEAVY_INVERSE,
  AN_NORMAL_INVERSE,
  AN_LIGHT_INVERSE,
  AN_WORMHOLE_RANDOM,
  AN_WORMHOLE_PAIRED
}

type AnomalyProps = {
  anomalyEffect?: AnomalyEffect,
}

export const createAnomaly: EntityGenerator<AnomalyProps> = (world, pos, props) => {
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.ANOMALY,
    radius: BASE_ANOMALY_RAD,
  });

  const vividRange = world.random.pickElement([
    rgb(155, 20, 20),
    rgb(20, 155, 20),
    rgb(20, 20, 155)
  ]);

  Renderable.col[eid] = world.random.colour(
    rgb(100, 100, 100),
    vividRange
  ).num()

  const anomalyEffect = props?.anomalyEffect ?? world.random.between(0, 10);

  Renderable.variant[eid] = anomalyEffect;

  switch(anomalyEffect) {
    case AnomalyEffect.AN_WHITE_HOLE: {
      HasGravity.strength[eid] = BASE_ANOMALY_RAD * 1500 * -1;
    }
    case AnomalyEffect.AN_WHITE_DWARF: {
      HasGravity.strength[eid] = BASE_ANOMALY_RAD * 1500;
    }
    case AnomalyEffect.AN_HEAVY: {
      HasGravity.strength[eid] = BASE_GRAV * 3;
    }
    case AnomalyEffect.AN_NORMAL: {
      HasGravity.strength[eid] = BASE_GRAV;
    }
    case AnomalyEffect.AN_LIGHT: {
      HasGravity.strength[eid] = BASE_GRAV / 3;
    }
    case AnomalyEffect.AN_LINEAR: {
      HasGravity.strength[eid] = BASE_LINEAR_GRAV;
      HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
    }
    case AnomalyEffect.AN_HEAVY_INVERSE: {
      HasGravity.strength[eid] = BASE_GRAV * 3 * -1;
    }
    case AnomalyEffect.AN_NORMAL_INVERSE: {
      HasGravity.strength[eid] = BASE_GRAV * -1;
    }
    case AnomalyEffect.AN_LIGHT_INVERSE: {
      HasGravity.strength[eid] = BASE_GRAV / 3 * -1;
    }
    case AnomalyEffect.AN_WORMHOLE_RANDOM: {
      HasGravity.strength[eid] = BASE_GRAV;
      addComponent(world, eid, Wormhole);
      Wormhole.exitType[eid] = ExitTypes.RANDOM;
    }
    case AnomalyEffect.AN_WORMHOLE_PAIRED: {
      HasGravity.strength[eid] = BASE_GRAV;
      addComponent(world, eid, Wormhole);
      Wormhole.exitType[eid] = ExitTypes.PAIRED;
    }
  }

  return eid;
};

