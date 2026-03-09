import { Position, Collision } from 'shared/src/ecs/components';
import { Depths, RenderObject } from '../types';
import { addShadow } from '../elements/shadow';
import { Renderable } from '../components';
import { ui32ToCol } from 'shared/src/utils';

const renderAsteroid: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const colour = Renderable.col[eid];
  const circle = scene.add.circle(0, 0, radius, ui32ToCol(colour));
  const container = scene.add.container(x, y);
  container.add(circle);
  addShadow(scene, container, radius);
  container.setDepth(Depths.PLANETS);
  return container;
};

export default renderAsteroid;
