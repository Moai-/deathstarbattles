import { addEntity, addComponent } from "bitecs";
import { Active, ObjectInfo, HyperLocus } from "shared/src/ecs/components";
import { GameWorld } from "shared/src/ecs/world";
import { ObjectTypes } from "shared/src/types";

export const createLocus = (world: GameWorld) => {
  const eid = addEntity(world);
  addComponent(world, eid, Active);
  addComponent(world, eid, ObjectInfo);
  addComponent(world, eid, HyperLocus);

  ObjectInfo.type[eid] = ObjectTypes.LOCUS;

  return eid;
};