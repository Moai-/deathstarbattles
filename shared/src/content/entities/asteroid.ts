import { EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { ASTEROID_GRAV_MULTIPLIER, ASTEROID_RAD, ASTEROID_RAD_JITTER } from "../consts";
import { rgb } from "shared/src/utils";

type AsteroidProps = {
  radius?: number;
}

export const createAsteroid: EntityGenerator<AsteroidProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(ASTEROID_RAD, ASTEROID_RAD_JITTER);
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.ASTEROID,
    gravityStrength: radius * ASTEROID_GRAV_MULTIPLIER,
    radius,
    colour: rgb(119, 78, 0)
  });

  return eid;
}