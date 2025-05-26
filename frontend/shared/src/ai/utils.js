import { hasComponent } from 'bitecs';
import { Destructible } from '../ecs/components/destructible';
import { Position } from '../ecs/components/position';
import { MAX_DIST_SQ } from './consts';
export const getOtherDestructibles = (world, ownEid, allObjects) => {
    return allObjects.filter((object) => {
        if (object.eid === ownEid) {
            return false;
        }
        if (hasComponent(world, Destructible, object.eid)) {
            return true;
        }
        return false;
    });
};
export const getPosition = (eid) => ({
    x: Position.x[eid],
    y: Position.y[eid],
});
export const getClosestTarget = (ownEid, targets) => {
    const ownPoint = getPosition(ownEid);
    return targets
        .map((target) => {
        const targetPoint = { x: target.x, y: target.y };
        return {
            eid: target.eid,
            dist: getSquaredDistance(targetPoint, ownPoint),
        };
    })
        .sort((a, b) => a.dist - b.dist)[0].eid;
};
export const getSquaredDistance = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
};
export const getClosestDestructible = (world, ownEid, allObjects) => {
    const otherTargets = getOtherDestructibles(world, ownEid, allObjects);
    return getClosestTarget(ownEid, otherTargets);
};
export const getRandomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export const getAngleBetween = (a, b) => {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};
export const getPower = (ownPoint, target, error = 0) => {
    const sqDist = getSquaredDistance(ownPoint, target);
    const rawPower = sqDist > MAX_DIST_SQ ? 100 : (sqDist / MAX_DIST_SQ) * 100;
    return Math.min(Math.max(rawPower + error, 20), 100);
};
