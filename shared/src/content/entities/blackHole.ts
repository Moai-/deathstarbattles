import { EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { BLACK_HOLE_GRAV_JITTER, BLACK_HOLE_GRAV, BLACK_HOLE_RAD } from "../consts";
import { rgb } from "shared/src/utils";

type BlackHoleProps = {
  gravity?: number;
}

export const createBlackHole: EntityGenerator<BlackHoleProps> = (world, pos, props) => {
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.BLACK_HOLE,
    radius: BLACK_HOLE_RAD,
    gravityStrength: props?.gravity ?? world.random.jitter(BLACK_HOLE_GRAV, BLACK_HOLE_GRAV_JITTER),
    colour: rgb(0, 0, 0)
  });

  return eid;
}