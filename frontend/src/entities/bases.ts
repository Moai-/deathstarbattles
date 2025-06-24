import { addComponent, addEntity, IWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjType } from 'shared/src/ecs/components/objType';
import { ObjectTypes } from 'shared/src/types';

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
  addComponent(world, ObjType, eid);

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = radius;
  ObjType.type[eid] = type;

  return eid;
};
