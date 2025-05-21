import { defineQuery, enterQuery, defineSystem, exitQuery } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
//import { Velocity } from 'shared/src/ecs/components/velocity';
import { Renderable } from './components/renderable';
import { GameObjectManager } from './objectManager';
import { LeavesTrail } from './components/leavesTrail';
import { ui32ToCol } from '../util/col';
import { Collision } from 'shared/src/ecs/components/collision';

const renderQuery = defineQuery([Position, Renderable]);
const renderQueryEnter = enterQuery(renderQuery);
const renderQueryExit = exitQuery(renderQuery);

const trailQuery = defineQuery([Position, LeavesTrail]);

export const createRenderSystem = (
  scene: Phaser.Scene,
  objectManager: GameObjectManager,
) => {
  return defineSystem((world) => {
    const enteredEntities = renderQueryEnter(world);

    for (const eid of enteredEntities) {
      objectManager.create(eid);
    }

    const exitedEntities = renderQueryExit(world);

    for (const eid of exitedEntities) {
      objectManager.remove(eid);
    }

    const updatedEntities = renderQuery(world);

    for (const eid of updatedEntities) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      objectManager.updatePosition(eid, x, y);
    }

    const updatedTrails = trailQuery(world);

    for (const eid of updatedTrails) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      const radius = Collision.radius[eid];
      const col = ui32ToCol(LeavesTrail.col[eid]);
      const circle = scene.add.circle(x, y, radius, col, 1);
      objectManager.createChild(eid, circle);
    }

    return world;
  });
};
