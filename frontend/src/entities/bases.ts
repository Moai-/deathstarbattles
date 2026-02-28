import { addComponent, addEntity, World } from 'bitecs';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import {
  Position,
  HasGravity,
  ObjectInfo,
  Active,
  Collision,
} from 'shared/src/ecs/components';
import { GravityFalloffType } from 'shared/src/ecs/components/hasGravity';

export const createCollidingBase = (
  world: World,
  x: number,
  y: number,
  radius: number,
  type: ObjectTypes,
) => {
  const eid = addEntity(world);
  addComponent(world, eid, Position);
  addComponent(world, eid, Collision);
  addComponent(world, eid, Renderable);
  addComponent(world, eid, HasGravity);
  addComponent(world, eid, ObjectInfo);
  addComponent(world, eid, Active);

  Position.x[eid] = x;
  Position.y[eid] = y;
  HasGravity.falloffType[eid] = GravityFalloffType.INVERSE_SQUARE;
  Collision.radius[eid] = radius;
  ObjectInfo.type[eid] = type;

  return eid;
};
