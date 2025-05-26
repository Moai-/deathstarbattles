import { Position } from 'shared/src/ecs/components/position';
import { RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { addShadow } from '../elements/shadow';

const renderPlanet: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const circle = scene.add.circle(0, 0, radius, 0x95774e);
  const container = scene.add.container(x, y);
  container.add(circle);
  addShadow(scene, container, radius);
  container.setDepth(1);
  return container;
};

export default renderPlanet;
