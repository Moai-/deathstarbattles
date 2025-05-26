import { addComponent, addEntity } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';
export const BLACK_HOLE_RAD = 2;
export const createBlackHole = (world, x, y) => {
    const eid = addEntity(world);
    addComponent(world, Position, eid);
    addComponent(world, Collision, eid);
    addComponent(world, Renderable, eid);
    addComponent(world, HasGravity, eid);
    Position.x[eid] = x;
    Position.y[eid] = y;
    Renderable.type[eid] = RenderableTypes.BLACK_HOLE;
    Collision.radius[eid] = BLACK_HOLE_RAD;
    HasGravity.strength[eid] = 20000;
    // HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
    return eid;
};
export const createRandomBlackHole = (world) => {
    return createBlackHole(world, 0, 0);
};
