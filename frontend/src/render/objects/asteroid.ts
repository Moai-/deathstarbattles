import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { addShadow } from '../elements/shadow';

const renderAsteroid: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const circle = scene.add.circle(0, 0, radius, 0x774e00);
  const container = scene.add.container(x, y);
  container.add(circle);
  addShadow(scene, container, radius);
  container.setDepth(Depths.PLANETS);
  return container;
};

export default renderAsteroid;
