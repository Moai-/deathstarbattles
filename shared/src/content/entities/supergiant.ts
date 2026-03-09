import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { HasGravity, Renderable } from "shared/src/ecs/components";
import { GravityFalloffType } from "shared/src/ecs/components/hasGravity";
import {
  SUPERGIANT_GRAV_DIVISOR,
  SUPERGIANT_RAD,
  SUPERGIANT_RAD_JITTER,
} from "../consts";
import { rgb } from "shared/src/utils";

type SupergiantProps = {
  radius?: number;
  colour?: Colour;
}

export const createSupergiant: EntityGenerator<SupergiantProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(SUPERGIANT_RAD, SUPERGIANT_RAD_JITTER);
  const colour = props?.colour ?? world.random.colour(
    rgb(253, 40, 10),
    rgb(3, 216, 51)
  );
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.SUPERGIANT,
    radius,
    gravityStrength: radius / SUPERGIANT_GRAV_DIVISOR,
    colour,
  });

  HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;

  return eid;
};
