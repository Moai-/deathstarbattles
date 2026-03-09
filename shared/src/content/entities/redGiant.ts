import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import {
  RED_GIANT_GRAV_MULTIPLIER,
  RED_GIANT_RAD,
  RED_GIANT_RAD_JITTER,
} from "../consts";
import { rgb } from "shared/src/utils";

type RedGiantProps = {
  radius?: number;
  colour?: Colour;
}

export const createRedGiant: EntityGenerator<RedGiantProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(RED_GIANT_RAD, RED_GIANT_RAD_JITTER);
  const colour = props?.colour ?? world.random.colour(
    rgb(230, 70, 40),
    rgb(25, 10, 10)
  );
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.RED_GIANT,
    radius,
    gravityStrength: radius * RED_GIANT_GRAV_MULTIPLIER,
    colour,
  });

  return eid;
};
