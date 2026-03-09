import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { rgb } from "shared/src/utils";
import { JOVIAN_GRAV_MULTIPLIER, JOVIAN_RAD, JOVIAN_RAD_JITTER } from "../consts";
import { createCollidingBase } from "./bases";

type JovianProps = {
  radius?: number;
  colour?: Colour;
}

export const createJovian: EntityGenerator<JovianProps> = (world, pos, props) => {
  const colour = rgb(props?.colour ?? world.random.colour(
    rgb(140, 0, 0),
    rgb(111, 121, 51)
  ));

  const radius = props?.radius ?? world.random.jitter(JOVIAN_RAD, JOVIAN_RAD_JITTER);

  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.JOVIAN,
    gravityStrength: radius * JOVIAN_GRAV_MULTIPLIER,
    radius,
    colour,
  });

  return eid;
}