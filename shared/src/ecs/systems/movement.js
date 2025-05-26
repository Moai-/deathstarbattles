import { defineQuery, defineSystem } from 'bitecs';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';
const movingQuery = defineQuery([Position, Velocity]);
const slow = 1 / 400;
export const createMovementSystem = () => {
    return defineSystem((world) => {
        const w = world;
        const dt = w.delta;
        const entities = movingQuery(world);
        if (entities.length) {
            w.movements = w.movements || {};
        }
        for (const eid of entities) {
            w.movements[eid] = w.movements[eid] || { id: eid, movementTrace: [] };
            const vx = Velocity.x[eid];
            const vy = Velocity.y[eid];
            const dx = vx * dt * slow;
            const dy = vy * dt * slow;
            const newX = Position.x[eid] + dx;
            const newY = Position.y[eid] + dy;
            Position.x[eid] = newX;
            Position.y[eid] = newY;
            w.movements[eid].movementTrace.push({ x: newX, y: newY });
        }
        return world;
    });
};
