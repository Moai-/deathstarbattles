import { Position } from 'shared/src/ecs/components/position';
import { RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';

const renderBlackHole: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const circle = scene.add.circle(0, 0, radius, 0x000000, 0);
  const container = scene.add.container(x, y);
  container.add(circle);
  if (scene.debug) {
    const nonInterfere = scene.add
      .circle(0, 0, 120, 0, 0)
      .setStrokeStyle(1, 0xff0000, 1);
    container.add(nonInterfere);
  }
  return container;
};

export default renderBlackHole;
