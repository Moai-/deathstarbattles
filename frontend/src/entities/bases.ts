import { addComponent, addEntity, IWorld } from 'bitecs';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import {
  Position,
  HasGravity,
  ObjectInfo,
  Active,
  Collision,
} from 'shared/src/ecs/components';

export const createCollidingBase = (
  world: IWorld,
  x: number,
  y: number,
  radius: number,
  type: ObjectTypes,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Collision, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, HasGravity, eid);
  addComponent(world, ObjectInfo, eid);
  addComponent(world, Active, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = radius;
  ObjectInfo.type[eid] = type;

  return eid;
};
