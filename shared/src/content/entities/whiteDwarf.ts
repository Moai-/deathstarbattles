import { EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import {
  WHITE_DWARF_GRAV_MULTIPLIER,
  WHITE_DWARF_GRAV_OFFSET,
  WHITE_DWARF_RAD,
  WHITE_DWARF_RAD_JITTER,
} from "../consts";
import { rgb } from "shared/src/utils";

type WhiteDwarfProps = {
  radius?: number;
}

export const createWhiteDwarf: EntityGenerator<WhiteDwarfProps> = (world, pos, props) => {
  const radius = props?.radius ?? world.random.jitter(WHITE_DWARF_RAD, WHITE_DWARF_RAD_JITTER);
  const colour = world.random.colour(
    rgb(230, 230, 230),
    rgb(25, 25, 25)
  );
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.WHITE_DWARF,
    radius,
    gravityStrength: (radius + WHITE_DWARF_GRAV_OFFSET) * WHITE_DWARF_GRAV_MULTIPLIER,
    colour,
  });

  return eid;
};
