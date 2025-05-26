import { addComponent, addEntity } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';
export const MIN_ASTEROID_RAD = 15;
export const MAX_ASTEROID_RAD = 35;
export const createAsteroid = (world, x, y, radius) => {
    const eid = addEntity(world);
    addComponent(world, Position, eid);
    addComponent(world, Collision, eid);
    addComponent(world, Renderable, eid);
    addComponent(world, HasGravity, eid);
    Position.x[eid] = x;
    Position.y[eid] = y;
    Renderable.type[eid] = RenderableTypes.ASTEROID;
    Collision.radius[eid] = radius;
    HasGravity.strength[eid] = radius * 25;
    return eid;
};
export const createRandomAsteroid = (world) => {
    const radius = Phaser.Math.Between(MIN_ASTEROID_RAD, MAX_ASTEROID_RAD);
    return createAsteroid(world, 0, 0, radius);
};
