import { addComponent, addEntity, IWorld } from 'bitecs';
import { Active, HyperLocus, ObjectInfo } from 'shared/src/ecs/components';
import { ObjectTypes } from 'shared/src/types';

export const MIN_ASTEROID_RAD = 15;
export const MAX_ASTEROID_RAD = 35;

export const createLocus = (world: IWorld) => {
  const eid = addEntity(world);
  addComponent(world, Active, eid);
  addComponent(world, ObjectInfo, eid);
  addComponent(world, HyperLocus, eid);

  ObjectInfo.type[eid] = ObjectTypes.LOCUS;

  return eid;
};
