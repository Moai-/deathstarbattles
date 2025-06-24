import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import { addShadow } from '../elements/shadow';
import { ui32ToCol } from 'shared/src/utils';

const renderJovian: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const circle = scene.add.circle(0, 0, radius, ui32ToCol(Renderable.col[eid]));
  const container = scene.add.container(x, y);
  container.add(circle);
  addShadow(scene, container, radius);
  container.setDepth(Depths.PLANETS);
  return container;
};

export default renderJovian;
