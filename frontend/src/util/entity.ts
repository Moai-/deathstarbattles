import { Collision } from 'shared/src/ecs/components/collision';
import { Position } from 'shared/src/ecs/components/position';

interface AnyPoint {
  x: number;
  y: number;
}

const setPosition = (eid: number, x: number | AnyPoint, y?: number) => {
  if (typeof (x as AnyPoint).x !== 'undefined') {
    const pt = x as AnyPoint;
    Position.x[eid] = pt.x;
    Position.y[eid] = pt.y;
  } else {
    Position.x[eid] = x as number;
    Position.y[eid] = y!;
  }
};

const getPosition = (eid: number) => ({
  x: Position.x[eid],
  y: Position.y[eid],
});

const getRadius = (eid: number) => Collision.radius[eid];

export { setPosition, getPosition, getRadius };
