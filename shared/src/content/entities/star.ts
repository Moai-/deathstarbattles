import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { STAR_GRAV_MULTIPLIER, STAR_RAD, STAR_RAD_JITTER } from "../consts";
import { rgb } from "shared/src/utils";

type StarProps = {
  radius?: number;
  colour?: Colour;
}

export const createStar: EntityGenerator<StarProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(STAR_RAD, STAR_RAD_JITTER);
  const colour = props?.colour ?? world.random.colour(
    rgb(254, 250, 100),
    rgb(2, 6, 156)
  );
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.STAR,
    radius,
    gravityStrength: radius * STAR_GRAV_MULTIPLIER,
    colour,
  });

  return eid;
};
