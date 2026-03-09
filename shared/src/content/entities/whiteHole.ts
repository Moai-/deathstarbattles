import { EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { Renderable } from "shared/src/ecs/components";
import {
  WHITE_HOLE_GRAV_MULTIPLIER,
  WHITE_HOLE_GRAV_OFFSET,
  WHITE_HOLE_RAD,
  WHITE_HOLE_RAD_JITTER,
} from "../consts";
import { rgb } from "shared/src/utils";

type WhiteHoleProps = {
  radius?: number;
}

export const createWhiteHole: EntityGenerator<WhiteHoleProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(WHITE_HOLE_RAD, WHITE_HOLE_RAD_JITTER);
  const colour = world.random.colour(
    rgb(230, 230, 230),
    rgb(25, 25, 25)
  );
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.WHITE_HOLE,
    radius,
    gravityStrength: (radius + WHITE_HOLE_GRAV_OFFSET) * WHITE_HOLE_GRAV_MULTIPLIER * -1,
    colour,
  });

  return eid;
};
