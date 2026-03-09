import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase, addJets } from "./bases";
import { Renderable } from "shared/src/ecs/components";
import {
  NEUTRON_STAR_GRAV_MULTIPLIER,
  NEUTRON_STAR_GRAV_OFFSET,
  NEUTRON_STAR_RAD,
  NEUTRON_STAR_RAD_JITTER,
} from "../consts";
import { rgb } from "shared/src/utils";

type NeutronStarProps = {
  radius?: number;
  axisAngle?: number;
  spreadAngle?: number;
  deflectAngle?: number;
  strength?: number;
  colour?: Colour
}

export const createNeutronStar: EntityGenerator<NeutronStarProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(NEUTRON_STAR_RAD, NEUTRON_STAR_RAD_JITTER);
  const colour = props?.colour ?? world.random.colour(
    rgb(200, 150, 230),
    rgb(25, 25, 25)
  );
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.NEUTRON_STAR,
    radius,
    gravityStrength: (radius + NEUTRON_STAR_GRAV_OFFSET) * NEUTRON_STAR_GRAV_MULTIPLIER,
    colour,
  });

  addJets(eid, world, {
    axisAngle: props?.axisAngle ?? world.random.between(0, 360),
    spreadAngle: props?.spreadAngle ?? 12,
    deflectAngle: props?.deflectAngle ?? 10,
    strength: props?.strength ?? 8
  });

  return eid;
};
