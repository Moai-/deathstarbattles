import { Collision } from 'shared/src/ecs/components/collision';
import { Position } from 'shared/src/ecs/components/position';
const setPosition = (eid, x, y) => {
    if (typeof x.x !== 'undefined') {
        const pt = x;
        Position.x[eid] = pt.x;
        Position.y[eid] = pt.y;
    }
    else {
        Position.x[eid] = x;
        Position.y[eid] = y;
    }
};
const getPosition = (eid) => ({
    x: Position.x[eid],
    y: Position.y[eid],
});
const getRadius = (eid) => Collision.radius[eid];
export { setPosition, getPosition, getRadius };
