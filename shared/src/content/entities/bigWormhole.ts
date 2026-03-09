import { ExitTypes, Wormhole } from "shared/src/ecs/components/wormhole"
import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types"
import { createCollidingBase } from "./bases"
import { BASE_LINEAR_GRAV, SUPERGIANT_RAD, SUPERGIANT_RAD_JITTER } from "../consts"
import { rgb } from "shared/src/utils"
import { addComponent } from "bitecs"
import { HasGravity } from "shared/src/ecs/components"
import { GravityFalloffType } from "shared/src/ecs/components/hasGravity"

type WormholeProps = {
  exitType?: ExitTypes,
  radius?: number,
  colour?: Colour,
}

export const createBigWormhole: EntityGenerator<WormholeProps> = (world, pos, props) => {
  const radius = props?.radius || world.random.jitter(SUPERGIANT_RAD, SUPERGIANT_RAD_JITTER);
  const eid = createCollidingBase(world, pos, {
    objectType: ObjectTypes.BIG_WORMHOLE,
    radius,
    gravityStrength: radius * BASE_LINEAR_GRAV,
    colour: props?.colour ?? world.random.colour(rgb(20, 20, 20), rgb(200, 200, 200))
  });

  HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;

  addComponent(world, eid, Wormhole);
  Wormhole.exitType[eid] = props?.exitType || ExitTypes.RANDOM;

  return eid;
}