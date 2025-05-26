import { createWorld } from 'bitecs';
export const createGameWorld = () => {
    const world = createWorld();
    world.time = 0;
    world.delta = 0;
    return world;
};
