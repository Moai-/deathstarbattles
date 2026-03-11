import { EntityGenerator, ObjectTypes } from "shared/src/types";
import { createBlackHole } from "./blackHole";
import { Collision, ObjectInfo } from "shared/src/ecs/components";
import { JET_BLACK_HOLE_RAD } from "../consts";
import { addJets } from "./bases";

type JetBlackHoleProps = {
  axisAngle?: number;
  spreadAngle?: number;
  length?: number;
  strength?: number;
  gravity?: number;
}

export const createJetBlackHole: EntityGenerator<JetBlackHoleProps> = (world, pos, props) => {
  const eid = createBlackHole(world, pos, props);

  Collision.radius[eid] = JET_BLACK_HOLE_RAD;
  ObjectInfo.type[eid] = ObjectTypes.JET_BLACK_HOLE;

  addJets(eid, world, {
    axisAngle: props?.axisAngle ?? world.random.between(0, 360),
    spreadAngle: props?.spreadAngle ?? world.random.between(6, 16),
    length: props?.length ?? world.random.between(500, 1000),
    strength: props?.strength ?? world.random.between(10, 30)
  });

  return eid;
}