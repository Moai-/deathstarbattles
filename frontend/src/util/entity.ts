import { Collision } from 'shared/src/ecs/components/collision';
import { Position } from 'shared/src/ecs/components/position';
import { ExitTypes, Wormhole } from 'shared/src/ecs/components/wormhole';
import { Renderable } from 'src/render/components/renderable';
import { RenderableTypes } from 'src/render/types';

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
  const pairType =
    getType(eid1) === RenderableTypes.BIG_WORMHOLE
      ? ExitTypes.PAIRED_GIANT
      : ExitTypes.PAIRED;
  Wormhole.exitType[eid1] = pairType;
  Wormhole.exitType[eid2] = pairType;
  Wormhole.teleportTarget[eid1] = eid2;
  Wormhole.teleportTarget[eid2] = eid1;
};

const scrambleWormhole = (eid: number) => {
  Wormhole.exitType[eid] = ExitTypes.RANDOM;
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
