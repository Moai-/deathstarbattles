import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { PLANET_GRAV_MULTIPLIER, PLANET_RAD, PLANET_RAD_JITTER } from "../consts";
import { rgb } from "shared/src/utils";

type PlanetProps = {
  radius?: number;
  colour?: Colour;
}

export const createPlanet: EntityGenerator<PlanetProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(PLANET_RAD, PLANET_RAD_JITTER);
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.PLANET,
    radius,
    gravityStrength: radius * PLANET_GRAV_MULTIPLIER,
    colour: props?.colour ?? rgb(149, 119, 78)
  });

  return eid;
};
