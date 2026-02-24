import { addComponent, addEntity, World } from 'bitecs';
import { Active, HyperLocus, ObjectInfo } from 'shared/src/ecs/components';
import { ObjectTypes } from 'shared/src/types';

export const MIN_ASTEROID_RAD = 15;
export const MAX_ASTEROID_RAD = 35;

export const createLocus = (world: World) => {
  const eid = addEntity(world);
  addComponent(world, eid, Active);
  addComponent(world, eid, ObjectInfo);
  addComponent(world, eid, HyperLocus);

  ObjectInfo.type[eid] = ObjectTypes.LOCUS;

  return eid;
};
