import { Collision } from 'shared/src/ecs/components/collision';
import { Position } from 'shared/src/ecs/components/position';
import { Wormhole } from 'shared/src/ecs/components/wormhole';
import { Renderable } from 'src/render/components/renderable';

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

const getType = (eid: number) => Renderable.type[eid];

const pairWormholes = (eid1: number, eid2: number) => {
  Wormhole.noExit[eid1] = 0;
  Wormhole.noExit[eid2] = 0;
  Wormhole.teleportTarget[eid1] = eid2;
  Wormhole.teleportTarget[eid2] = eid1;
};

const scrambleWormhole = (eid: number) => {
  Wormhole.noExit[eid] = 1;
  Wormhole.teleportTarget[eid] = 0;
};

export {
  setPosition,
  getPosition,
  getRadius,
  getType,
  pairWormholes,
  scrambleWormhole,
};
