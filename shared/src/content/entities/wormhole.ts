import { addComponent } from "bitecs";
import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { createCollidingBase } from "./bases";
import { Wormhole } from "shared/src/ecs/components";
import { ExitTypes } from "shared/src/ecs/components/wormhole";
import { WORMHOLE_GRAV_MULTIPLIER, WORMHOLE_RAD, WORMHOLE_RAD_JITTER } from "../consts";
import { rgb } from "shared/src/utils";

type WormholeProps = {
  radius?: number;
  exitType?: ExitTypes;
  colour?: Colour
}

export const createWormhole: EntityGenerator<WormholeProps> = (world, pos, props) => {
  const colour = props?.colour ?? world.random.colour(
    rgb(20, 20, 20),
    rgb(200, 200, 200)
  );
  const radius = props?.radius ?? world.random.jitter(WORMHOLE_RAD, WORMHOLE_RAD_JITTER);
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.WORMHOLE,
    radius,
    gravityStrength: radius * WORMHOLE_GRAV_MULTIPLIER,
    colour,
  });

  addComponent(world, eid, Wormhole);
  Wormhole.exitType[eid] = props?.exitType ?? ExitTypes.RANDOM;

  return eid;
};
