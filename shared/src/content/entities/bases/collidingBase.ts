import { addComponent, addEntity } from "bitecs";
import { Active, Collision, HasGravity, ObjectInfo, Position, Renderable } from "shared/src/ecs/components";
import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { GravityFalloffType } from "shared/src/ecs/components/hasGravity";
import { rgb } from "shared/src/utils";

type CollidingBaseProps = {
  objectType: ObjectTypes,
  radius?: number,
  gravityStrength?: number;
  colour?: Colour;
}

const defaultCollidingBaseProps: CollidingBaseProps = {
  radius: 0,
  objectType: ObjectTypes.NONE,
  gravityStrength: 0,
  colour: rgb(0, 0, 0)!,
}

// Base for a simple object with a collision radius, a position, and an object type
export const createCollidingBase: EntityGenerator<CollidingBaseProps> = (world, pos, props) => {
  const {
    objectType, 
    gravityStrength, 
    radius, 
    colour
  } = {...defaultCollidingBaseProps, ...props};
  
  const eid = addEntity(world);
  addComponent(world, eid, Position);
  Position.x[eid] = pos.x;
  Position.y[eid] = pos.y;

  addComponent(world, eid, Collision);
  Collision.radius[eid] = radius ?? 0;

  addComponent(world, eid, HasGravity);
  HasGravity.falloffType[eid] = GravityFalloffType.INVERSE_SQUARE;
  HasGravity.strength[eid] = gravityStrength ?? 0;

  addComponent(world, eid, ObjectInfo);
  ObjectInfo.type[eid] = objectType;
  ObjectInfo.owner[eid] = 0;
  ObjectInfo.cloneOf[eid] = 0;

  addComponent(world, eid, Renderable);
  Renderable.col[eid] = rgb(colour ?? rgb(0, 0, 0)).num();
  Renderable.variant[eid] = 0;
  
  addComponent(world, eid, Active);

  return eid;
}